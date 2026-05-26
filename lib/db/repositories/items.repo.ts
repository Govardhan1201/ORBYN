import { Db, ObjectId, Filter } from 'mongodb';
import { getDb } from '../mongodb';
import { Item, ItemType, ItemVisibility, ItemScore, ItemMeta, ItemAI, ItemTopics } from '@/types/item.types';

export class ItemsRepository {
  private async db(): Promise<Db> {
    return getDb();
  }

  private col(db: Db) {
    return db.collection<Item>('items');
  }

  async findById(id: string | ObjectId): Promise<Item | null> {
    const db = await this.db();
    return this.col(db).findOne({ _id: new ObjectId(id) });
  }

  async findByUserId(
    userId: string,
    options: {
      type?: ItemType;
      topicId?: string;
      archived?: boolean;
      pinned?: boolean;
      visibility?: ItemVisibility;
      limit?: number;
      skip?: number;
      sortBy?: 'createdAt' | 'relevance' | 'usageCount' | 'title';
      sortDir?: 1 | -1;
      search?: string;
    } = {}
  ): Promise<Item[]> {
    const db = await this.db();
    const {
      type, topicId, archived = false, pinned,
      visibility, limit = 20, skip = 0,
      sortBy = 'createdAt', sortDir = -1, search,
    } = options;

    const filter: Filter<Item> = {
      userId: new ObjectId(userId),
      'score.archived': archived,
    };

    if (type) filter.type = type;
    if (topicId) filter['topics.primary'] = new ObjectId(topicId);
    if (pinned !== undefined) filter['score.pinned'] = pinned;
    if (visibility) filter.visibility = visibility;

    const sortField = sortBy === 'relevance' ? 'score.relevance'
      : sortBy === 'usageCount' ? 'score.usageCount'
      : sortBy;

    let cursor = this.col(db).find(filter);

    if (search) {
      cursor = this.col(db).find({
        ...filter,
        $text: { $search: search },
      });
    }

    return cursor
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async count(userId: string, filter: Partial<Filter<Item>> = {}): Promise<number> {
    const db = await this.db();
    return this.col(db).countDocuments({
      userId: new ObjectId(userId),
      ...filter,
    });
  }

  async create(data: {
    userId: string;
    type: ItemType;
    title: string;
    url?: string;
    filePath?: string;
    filePublicId?: string;
    meta?: Partial<ItemMeta>;
    ai?: Partial<ItemAI>;
    topics?: Partial<ItemTopics>;
    visibility?: ItemVisibility;
  }): Promise<Item> {
    const db = await this.db();
    const now = new Date();

    const item: Omit<Item, '_id'> = {
      userId: new ObjectId(data.userId),
      type: data.type,
      title: data.title,
      url: data.url,
      filePath: data.filePath,
      filePublicId: data.filePublicId,
      meta: {
        wordCount: 0,
        ...data.meta,
      },
      ai: data.ai || {},
      topics: {
        primary: undefined,
        secondary: [],
        tags: [],
        userTags: [],
        locked: false,
        confidence: 0,
        ...data.topics,
      },
      visibility: data.visibility || 'private',
      score: {
        relevance: 0.5,
        usageCount: 0,
        pinned: false,
        archived: false,
      },
      moderation: {
        reported: false,
        reportCount: 0,
        flaggedLowQuality: false,
        approved: true,
      },
      relatedItems: [],
      projectIds: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.col(db).insertOne(item as Item);
    return { ...item, _id: result.insertedId } as Item;
  }

  async update(id: string, userId: string, updates: Partial<Item>): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  async updateTopics(id: string, topics: Partial<ItemTopics>): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...Object.fromEntries(Object.entries(topics).map(([k, v]) => [`topics.${k}`, v])),
          updatedAt: new Date(),
        },
      }
    );
  }

  async updateAI(id: string, ai: Partial<ItemAI>): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...Object.fromEntries(Object.entries(ai).map(([k, v]) => [`ai.${k}`, v])),
          updatedAt: new Date(),
        },
      }
    );
  }

  async updateScore(id: string, score: Partial<ItemScore>): Promise<void> {
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

  async incrementUsage(id: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id) },
      {
        $inc: { 'score.usageCount': 1 },
        $set: { 'score.lastViewed': new Date(), updatedAt: new Date() },
      }
    );
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const db = await this.db();
    const result = await this.col(db).deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });
    return result.deletedCount > 0;
  }

  async findPublic(limit = 50, skip = 0): Promise<Item[]> {
    const db = await this.db();
    return this.col(db)
      .find({ visibility: { $in: ['public', 'public_meta'] } })
      .sort({ 'score.relevance': -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async addToProject(itemId: string, projectId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(itemId) },
      { $addToSet: { projectIds: new ObjectId(projectId) } }
    );
  }

  async removeFromProject(itemId: string, projectId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(itemId) },
      { $pull: { projectIds: new ObjectId(projectId) } }
    );
  }

  async findByTopicId(topicId: string, userId: string, limit = 20): Promise<Item[]> {
    const db = await this.db();
    return this.col(db)
      .find({
        userId: new ObjectId(userId),
        $or: [
          { 'topics.primary': new ObjectId(topicId) },
          { 'topics.secondary': new ObjectId(topicId) },
        ],
        'score.archived': false,
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async findRecentByUser(userId: string, limit = 10): Promise<Item[]> {
    const db = await this.db();
    return this.col(db)
      .find({ userId: new ObjectId(userId), 'score.archived': false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  async textSearch(userId: string, query: string, limit = 20): Promise<Item[]> {
    const db = await this.db();
    return this.col(db)
      .find({
        userId: new ObjectId(userId),
        $text: { $search: query },
        'score.archived': false,
      })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .toArray();
  }
}

export const itemsRepo = new ItemsRepository();
