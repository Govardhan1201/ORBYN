/**
 * Topic Engine — classifies items into the topic hierarchy,
 * creates/updates topic nodes, and builds graph edges.
 */
import { topicsRepo } from '@/lib/db/repositories/topics.repo';
import { edgesRepo } from '@/lib/db/repositories/edges.repo';
import { itemsRepo } from '@/lib/db/repositories/items.repo';
import { usersRepo } from '@/lib/db/repositories/users.repo';
import { aiClassify } from '@/lib/ai/provider';
import { ObjectId } from 'mongodb';
import { TOPIC_DOMAINS } from '@/types/topic.types';

// Rule-based classification fallback
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  'Technology': ['code', 'programming', 'software', 'api', 'react', 'javascript', 'typescript', 'python', 'ai', 'machine learning', 'llm', 'database', 'cloud', 'devops', 'docker', 'github', 'web', 'app', 'frontend', 'backend', 'fullstack', 'framework', 'library'],
  'Science': ['research', 'study', 'experiment', 'biology', 'chemistry', 'physics', 'math', 'statistics', 'neuroscience', 'genomics', 'quantum', 'astronomy'],
  'Design': ['ui', 'ux', 'figma', 'design', 'typography', 'color', 'animation', 'css', 'layout', 'brand', 'logo', 'graphic', 'illustration'],
  'Business': ['startup', 'product', 'market', 'revenue', 'saas', 'growth', 'strategy', 'finance', 'investment', 'venture', 'founder', 'entrepreneur'],
  'Arts & Culture': ['art', 'music', 'film', 'book', 'literature', 'culture', 'history', 'photography', 'writing', 'poetry', 'cinema'],
  'Health & Wellness': ['health', 'fitness', 'nutrition', 'mental', 'wellness', 'sleep', 'exercise', 'diet', 'medical', 'therapy'],
  'Education': ['learn', 'course', 'tutorial', 'guide', 'education', 'university', 'teaching', 'skill', 'training', 'workshop'],
  'Philosophy': ['philosophy', 'ethics', 'thinking', 'stoic', 'consciousness', 'logic', 'epistemology', 'metaphysics'],
  'Current Events': ['news', 'politics', 'economy', 'government', 'policy', 'climate', 'election', 'world'],
  'Entertainment': ['game', 'anime', 'movie', 'series', 'podcast', 'youtube', 'streaming', 'entertainment', 'comedy', 'sport'],
};

function ruleBasedClassify(text: string): { domain: string; confidence: number } {
  const lower = text.toLowerCase();
  let bestDomain = 'Other';
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    const score = keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestDomain = domain;
    }
  }

  return {
    domain: bestDomain,
    confidence: Math.min(bestScore / 5, 1.0),
  };
}

export interface ClassificationResult {
  topicId: string;
  topicName: string;
  domain: string;
  tags: string[];
  confidence: number;
}

export async function classifyAndLinkItem(
  itemId: string,
  userId: string,
  title: string,
  text: string,
  itemType: string,
  useAI = true
): Promise<ClassificationResult> {

  let domain = 'Other';
  let topicName = 'General';
  let subtopic: string | undefined;
  let tags: string[] = [];
  let confidence = 0.3;

  // Try AI classification first
  if (useAI && process.env.GEMINI_API_KEY) {
    const aiResult = await aiClassify(title, text, itemType);
    domain = aiResult.domain;
    topicName = aiResult.topic;
    subtopic = aiResult.subtopic;
    tags = aiResult.tags;
    confidence = aiResult.confidence;
  }

  // Fallback to rule-based if AI didn't return useful result
  if (confidence < 0.4 || domain === 'Other') {
    const ruleResult = ruleBasedClassify(`${title} ${text}`);
    if (ruleResult.confidence > confidence) {
      domain = ruleResult.domain;
      confidence = ruleResult.confidence;
    }
  }

  // Find or create domain-level topic
  const domainTopic = await topicsRepo.findOrCreate(domain, domain);

  // Find or create specific topic under domain
  const specificTopic = await topicsRepo.findOrCreate(
    topicName,
    domain,
    domainTopic._id.toString()
  );

  // Create subtopic if available
  let subtopicDoc = null;
  if (subtopic) {
    subtopicDoc = await topicsRepo.findOrCreate(
      subtopic,
      domain,
      specificTopic._id.toString()
    );
  }

  // The most specific topic to assign
  const primaryTopic = subtopicDoc || specificTopic;

  // Update item topics
  await itemsRepo.updateTopics(itemId, {
    primary: primaryTopic._id,
    secondary: subtopicDoc ? [specificTopic._id, domainTopic._id] : [domainTopic._id],
    tags,
    confidence,
  });

  // Update topic item counts
  await topicsRepo.incrementItemCount(primaryTopic._id.toString());
  if (subtopicDoc) {
    await topicsRepo.incrementItemCount(specificTopic._id.toString());
  }

  // Create graph edges (parent-child topic relationships)
  await edgesRepo.upsertEdge({
    userId,
    sourceId: domainTopic._id.toString(),
    targetId: specificTopic._id.toString(),
    sourceType: 'topic',
    targetType: 'topic',
    edgeType: 'parent',
    weight: 1.0,
  });

  if (subtopicDoc) {
    await edgesRepo.upsertEdge({
      userId,
      sourceId: specificTopic._id.toString(),
      targetId: subtopicDoc._id.toString(),
      sourceType: 'topic',
      targetType: 'topic',
      edgeType: 'parent',
      weight: 1.0,
    });
  }

  // Update user stats
  await usersRepo.incrementStat(userId, 'itemCount');

  return {
    topicId: primaryTopic._id.toString(),
    topicName: primaryTopic.name,
    domain,
    tags,
    confidence,
  };
}

export async function getUserTopicGraph(userId: string) {
  const topics = await topicsRepo.getForGraph();
  const edges = await edgesRepo.findByUserId(userId);

  const nodes = topics.map(t => ({
    id: t._id.toString(),
    name: t.name,
    slug: t.slug,
    domain: t.domain,
    color: t.color,
    parentId: t.parentId?.toString(),
    childIds: t.childIds.map(c => c.toString()),
    score: t.score,
    glowState: t.glowState,
    val: Math.max(4, Math.log(t.score.itemCount + 1) * 8 + 4),
  }));

  const links = edges.map(e => ({
    source: e.sourceId.toString(),
    target: e.targetId.toString(),
    edgeType: e.edgeType,
    weight: e.weight,
  }));

  return { nodes, links };
}
