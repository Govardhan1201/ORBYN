import { topicsRepo as TopicRepo } from '../db/repositories/topics.repo';
import { edgesRepo as EdgeRepo } from '../db/repositories/edges.repo';
import type { GraphData, TopicNode } from '@/types/topic.types';
import { ObjectId } from 'mongodb';

export class GraphService {
  /**
   * Builds the graph data (nodes and links) for a specific user, combining global
   * topics and their personal topics, as well as the edges connecting them.
   */
  static async getUserGraphData(userId: string | ObjectId): Promise<GraphData> {
    const userObjId = typeof userId === 'string' ? new ObjectId(userId) : userId;

    // 1. Fetch all relevant topics: global topics AND user-created topics
    const topics = await TopicRepo.find({
      $or: [
        { isGlobal: true },
        { createdBy: userObjId }
      ]
    });

    // 2. Fetch all edges for this user (or global edges)
    // For MVP, we'll fetch edges where either source or target is one of our topics
    // and userId matches or edge is public. To keep it simple, fetch all edges for this user.
    const edges = await EdgeRepo.find({
      $or: [
        { userId: userObjId },
        { isPublic: true }
      ]
    });

    // 3. Transform Topics into TopicNodes for the visualizer
    const nodes: TopicNode[] = topics.map(t => ({
      id: t._id.toString(),
      name: t.name,
      slug: t.slug,
      domain: t.domain,
      color: t.color,
      parentId: t.parentId?.toString(),
      childIds: t.childIds.map(id => id.toString()),
      score: t.score,
      glowState: t.glowState,
      // Calculate a visual size value based on centrality & items
      val: Math.max(4, Math.min(30, (t.score.itemCount * 2) + (t.score.centrality * 10))),
    }));

    // 4. Transform Edges into links
    // Filter edges to ensure both source and target exist in our nodes list
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = edges
      .filter(e => nodeIds.has(e.sourceId.toString()) && nodeIds.has(e.targetId.toString()))
      .map(e => ({
        source: e.sourceId.toString(),
        target: e.targetId.toString(),
        edgeType: e.edgeType,
        weight: e.weight || 1,
      }));

    return { nodes, links };
  }
}
