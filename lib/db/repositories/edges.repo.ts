import { Db, ObjectId } from 'mongodb';
import { getDb } from '../mongodb';
import { GraphEdge } from '@/types/topic.types';

export class EdgesRepository {
  private async db(): Promise<Db> { return getDb(); }
  private col(db: Db) { return db.collection<GraphEdge>('graph_edges'); }

  async findByUserId(userId: string): Promise<GraphEdge[]> {
    const db = await this.db();
    return this.col(db).find({ userId: new ObjectId(userId) }).toArray();
  }

  async findPublicEdges(limit = 500): Promise<GraphEdge[]> {
    const db = await this.db();
    return this.col(db).find({ isPublic: true }).limit(limit).toArray();
  }

  async upsertEdge(data: {
    userId?: string;
    sourceId: string;
    targetId: string;
    sourceType: 'topic' | 'item';
    targetType: 'topic' | 'item';
    edgeType: GraphEdge['edgeType'];
    weight?: number;
    isPublic?: boolean;
  }): Promise<void> {
    const db = await this.db();
    const now = new Date();
    await this.col(db).updateOne(
      {
        sourceId: new ObjectId(data.sourceId),
        targetId: new ObjectId(data.targetId),
        ...(data.userId ? { userId: new ObjectId(data.userId) } : {}),
      },
      {
        $set: {
          userId: data.userId ? new ObjectId(data.userId) : undefined,
          sourceId: new ObjectId(data.sourceId),
          targetId: new ObjectId(data.targetId),
          sourceType: data.sourceType,
          targetType: data.targetType,
          edgeType: data.edgeType,
          weight: data.weight ?? 0.5,
          isPublic: data.isPublic ?? false,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  async deleteByUser(userId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).deleteMany({ userId: new ObjectId(userId) });
  }

  async findConnectedTopics(topicId: string, userId?: string): Promise<string[]> {
    const db = await this.db();
    const filter = {
      $or: [
        { sourceId: new ObjectId(topicId) },
        { targetId: new ObjectId(topicId) },
      ],
      ...(userId ? { userId: new ObjectId(userId) } : {}),
    };
    const edges = await this.col(db).find(filter).toArray();
    const ids = new Set<string>();
    edges.forEach(e => {
      ids.add(e.sourceId.toString());
      ids.add(e.targetId.toString());
    });
    ids.delete(topicId);
    return Array.from(ids);
  }

  async incrementWeight(sourceId: string, targetId: string, by = 0.05): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { sourceId: new ObjectId(sourceId), targetId: new ObjectId(targetId) },
      { $inc: { weight: by }, $set: { updatedAt: new Date() } }
    );
  }
}

export const edgesRepo = new EdgesRepository();
