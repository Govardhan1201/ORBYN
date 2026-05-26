import { Db, ObjectId } from 'mongodb';
import { getDb } from '../mongodb';
import { Topic, GlowState } from '@/types/topic.types';
import { TopicScore } from '@/types/item.types';
import { DOMAIN_COLORS, TOPIC_DOMAINS } from '@/types/topic.types';

export class TopicsRepository {
  private async db(): Promise<Db> { return getDb(); }
  private col(db: Db) { return db.collection<Topic>('topics'); }

  async find(query: any): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db).find(query).toArray();
  }

  async findById(id: string | ObjectId): Promise<Topic | null> {
    const db = await this.db();
    return this.col(db).findOne({ _id: new ObjectId(id) });
  }

  async findBySlug(slug: string): Promise<Topic | null> {
    const db = await this.db();
    return this.col(db).findOne({ slug });
  }

  async findByName(name: string): Promise<Topic | null> {
    const db = await this.db();
    return this.col(db).findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { aliases: { $regex: new RegExp(`^${name}$`, 'i') } },
      ],
    });
  }

  async findOrCreate(name: string, domain: string, parentId?: string): Promise<Topic> {
    const existing = await this.findByName(name);
    if (existing) return existing;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const db = await this.db();
    const now = new Date();

    const defaultScore: TopicScore = {
      itemCount: 0, userCount: 0, publicItemCount: 0,
      usageCount: 0, centrality: 0, trending: 0, importance: 0,
    };

    const topic: Omit<Topic, '_id'> = {
      name, slug: await this.uniqueSlug(slug),
      aliases: [], domain,
      color: DOMAIN_COLORS[domain] || '#6b7280',
      parentId: parentId ? new ObjectId(parentId) : undefined,
      childIds: [], siblingIds: [], relatedIds: [],
      isGlobal: true, score: defaultScore,
      glowState: 'none', confidence: 0.8, locked: false,
      createdAt: now, updatedAt: now,
    };

    const result = await this.col(db).insertOne(topic as Topic);
    return { ...topic, _id: result.insertedId } as Topic;
  }

  async uniqueSlug(base: string): Promise<string> {
    const db = await this.db();
    let slug = base;
    let counter = 1;
    while (await this.col(db).findOne({ slug })) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }

  async findByDomain(domain: string, limit = 50): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db).find({ domain })
      .sort({ 'score.importance': -1 }).limit(limit).toArray();
  }

  async findChildren(parentId: string): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db).find({ parentId: new ObjectId(parentId) }).toArray();
  }

  async findTopLevel(limit = 30): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db)
      .find({ parentId: { $exists: false }, isGlobal: true })
      .sort({ 'score.importance': -1 }).limit(limit).toArray();
  }

  async findAll(limit = 200): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db).find({}).sort({ 'score.importance': -1 }).limit(limit).toArray();
  }

  async incrementItemCount(id: string, by = 1): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { 'score.itemCount': by, 'score.usageCount': by },
        $set: { updatedAt: new Date() },
      }
    );
    await this.recalculateGlowState(id);
  }

  async updateScore(id: string, score: Partial<TopicScore>): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...Object.fromEntries(Object.entries(score).map(([k, v]) => [`score.${k}`, v])),
          updatedAt: new Date(),
        },
      }
    );
  }

  async recalculateGlowState(id: string): Promise<void> {
    const topic = await this.findById(id);
    if (!topic) return;

    const { centrality, usageCount, trending, importance } = topic.score;
    let glowState: GlowState = 'none';

    if (centrality > 0.7) glowState = 'purple';
    else if (importance > 50) glowState = 'gold';
    else if (trending > 0.7) glowState = 'green';
    else if (usageCount > 10) glowState = 'blue';
    else if (topic.confidence < 0.4) glowState = 'red';

    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id) },
      { $set: { glowState, updatedAt: new Date() } }
    );
  }

  async addRelated(sourceId: string, targetId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(sourceId) },
      { $addToSet: { relatedIds: new ObjectId(targetId) } }
    );
  }

  async search(query: string, limit = 10): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db)
      .find({ $text: { $search: query } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .toArray();
  }

  async getForGraph(limit = 100): Promise<Topic[]> {
    const db = await this.db();
    return this.col(db)
      .find({ isGlobal: true })
      .sort({ 'score.itemCount': -1 })
      .limit(limit)
      .toArray();
  }

  async count(): Promise<number> {
    const db = await this.db();
    return this.col(db).countDocuments();
  }
}

export const topicsRepo = new TopicsRepository();
