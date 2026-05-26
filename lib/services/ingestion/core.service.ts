import { itemsRepo } from '../../db/repositories/items.repo';
import { topicsRepo } from '../../db/repositories/topics.repo';
import { edgesRepo as EdgeRepo } from '../../db/repositories/edges.repo';
import { aiClassify, aiSummarize, isAIAvailable } from '../../ai/provider';
import { ItemType, ItemVisibility } from '@/types/item.types';
import { ObjectId } from 'mongodb';

export interface IngestPayload {
  userId: string;
  type: ItemType;
  title: string;
  content: string; // The main text for AI processing
  url?: string;
  filePath?: string;
  filePublicId?: string;
  visibility?: ItemVisibility;
  domainOverride?: string; // Optional manual overrides
}

export async function ingestItem(payload: IngestPayload) {
  // 1. Process with AI (if enabled/available)
  let aiSummary = undefined;
  let aiClass = undefined;

  if (isAIAvailable() && process.env.NEXT_PUBLIC_ENABLE_AI !== 'false') {
    [aiSummary, aiClass] = await Promise.all([
      aiSummarize(payload.title, payload.content, payload.type),
      aiClassify(payload.title, payload.content, payload.type),
    ]);
  }

  // 2. Prepare Topic Classification
  let primaryTopicId: ObjectId | undefined;
  let tags: string[] = [];

  if (aiClass) {
    // Upsert the main topic
    const topic = await topicsRepo.findOrCreate(aiClass.topic, payload.domainOverride || aiClass.domain);
    primaryTopicId = topic._id;
    tags = aiClass.tags || [];
  } else {
    // Fallback topic if no AI
    const topic = await topicsRepo.findOrCreate('Uncategorized', payload.domainOverride || 'Other');
    primaryTopicId = topic._id;
  }

  // 3. Create Item
  const item = await itemsRepo.create({
    userId: payload.userId,
    type: payload.type,
    title: payload.title,
    url: payload.url,
    filePath: payload.filePath,
    filePublicId: payload.filePublicId,
    visibility: payload.visibility || 'private',
    meta: {
      wordCount: payload.content.split(/\s+/).length,
      domain: payload.url ? new URL(payload.url).hostname : undefined,
    },
    ai: aiSummary ? {
      summary: aiSummary.summary,
      keyPoints: aiSummary.keyPoints,
      sentiment: aiSummary.sentiment,
      model: aiSummary.model,
      summaryGeneratedAt: new Date(),
    } : undefined,
    topics: {
      primary: primaryTopicId,
      secondary: [],
      tags,
      userTags: [],
      locked: false,
      confidence: aiClass?.confidence || 1.0,
    }
  });

  // 4. Create Edges
  if (primaryTopicId) {
    // Edge from user to item
    await EdgeRepo.create({
      userId: new ObjectId(payload.userId),
      sourceId: new ObjectId(payload.userId),
      targetId: item._id,
      sourceType: 'item', // technically user, but treating as item to item for simplicity here, actually topics are connected
      targetType: 'item',
      edgeType: 'co-occurrence',
      weight: 1.0,
      isPublic: item.visibility === 'public'
    });

    // Edge from Topic to Item
    await EdgeRepo.create({
      userId: new ObjectId(payload.userId),
      sourceId: primaryTopicId,
      targetId: item._id,
      sourceType: 'topic',
      targetType: 'item',
      edgeType: 'parent',
      weight: aiClass?.confidence || 1.0,
      isPublic: item.visibility === 'public'
    });
    
    // Increment topic count
    await topicsRepo.incrementItemCount(primaryTopicId.toString());
  }

  return { item, aiSummary, aiClass };
}
