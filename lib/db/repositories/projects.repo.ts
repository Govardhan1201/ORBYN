import { Db, ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

export interface Project {
  _id: ObjectId;
  userId: ObjectId;
  name: string;
  slug: string;
  description?: string;
  coverColor: string;
  icon?: string;
  itemIds: ObjectId[];
  topicIds: ObjectId[];
  notes: string;
  todos: { text: string; done: boolean; order: number }[];
  status: 'active' | 'archived' | 'completed';
  visibility: 'private' | 'shared';
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDTO = Omit<Project, '_id' | 'userId' | 'itemIds' | 'topicIds'> & {
  _id: string;
  userId: string;
  itemIds: string[];
  topicIds: string[];
  itemCount: number;
};

export class ProjectsRepository {
  private async db(): Promise<Db> { return getDb(); }
  private col(db: Db) { return db.collection<Project>('projects'); }

  async findById(id: string): Promise<Project | null> {
    const db = await this.db();
    return this.col(db).findOne({ _id: new ObjectId(id) });
  }

  async findByUser(userId: string): Promise<Project[]> {
    const db = await this.db();
    return this.col(db)
      .find({ userId: new ObjectId(userId), status: { $ne: 'archived' } })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  async create(data: {
    userId: string;
    name: string;
    description?: string;
    coverColor?: string;
    icon?: string;
  }): Promise<Project> {
    const db = await this.db();
    const now = new Date();
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const project: Omit<Project, '_id'> = {
      userId: new ObjectId(data.userId),
      name: data.name,
      slug,
      description: data.description,
      coverColor: data.coverColor || '#3b82f6',
      icon: data.icon,
      itemIds: [],
      topicIds: [],
      notes: '',
      todos: [],
      status: 'active',
      visibility: 'private',
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.col(db).insertOne(project as Project);
    return { ...project, _id: result.insertedId } as Project;
  }

  async update(id: string, userId: string, updates: Partial<Project>): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  async addItem(projectId: string, itemId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(projectId) },
      { $addToSet: { itemIds: new ObjectId(itemId) }, $set: { updatedAt: new Date() } }
    );
  }

  async removeItem(projectId: string, itemId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(projectId) },
      { $pull: { itemIds: new ObjectId(itemId) }, $set: { updatedAt: new Date() } }
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

  async count(userId: string): Promise<number> {
    const db = await this.db();
    return this.col(db).countDocuments({ userId: new ObjectId(userId), status: 'active' });
  }
}

export const projectsRepo = new ProjectsRepository();
