import { Db, ObjectId, WithId, Filter } from 'mongodb';
import { getDb } from '../mongodb';
import { User, UserPreferences, DEFAULT_PREFERENCES, DEFAULT_STATS } from '@/types/user.types';
import bcrypt from 'bcryptjs';

export class UsersRepository {
  private async db(): Promise<Db> {
    return getDb();
  }

  private col(db: Db) {
    return db.collection<User>('users');
  }

  async findById(id: string | ObjectId): Promise<User | null> {
    const db = await this.db();
    return this.col(db).findOne({ _id: new ObjectId(id) });
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = await this.db();
    return this.col(db).findOne({ email: email.toLowerCase() });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const db = await this.db();
    return this.col(db).findOne({ googleId });
  }

  async create(data: {
    email: string;
    name: string;
    password?: string;
    googleId?: string;
    avatar?: string;
  }): Promise<User> {
    const db = await this.db();
    const now = new Date();

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;

    const user: Omit<User, '_id'> = {
      email: data.email.toLowerCase(),
      emailVerified: !!data.googleId,
      passwordHash,
      name: data.name,
      avatar: data.avatar,
      role: 'user',
      preferences: DEFAULT_PREFERENCES,
      stats: { ...DEFAULT_STATS, lastActive: now },
      badges: [],
      googleId: data.googleId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.col(db).insertOne(user as User);
    return { ...user, _id: result.insertedId } as User;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.passwordHash) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...Object.fromEntries(
            Object.entries(preferences).map(([k, v]) => [`preferences.${k}`, v])
          ),
          updatedAt: new Date(),
        },
      }
    );
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string }): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { ...data, updatedAt: new Date() } }
    );
  }

  async incrementStat(userId: string, stat: string, by = 1): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(userId) },
      {
        $inc: { [`stats.${stat}`]: by },
        $set: { 'stats.lastActive': new Date(), updatedAt: new Date() },
      }
    );
  }

  async updateLastActive(userId: string): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { 'stats.lastActive': new Date() } }
    );
  }

  async findAll(filter: Filter<User> = {}, limit = 50, skip = 0): Promise<User[]> {
    const db = await this.db();
    return this.col(db)
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();
  }

  async count(filter: Filter<User> = {}): Promise<number> {
    const db = await this.db();
    return this.col(db).countDocuments(filter);
  }

  async updateRole(userId: string, role: User['role']): Promise<void> {
    const db = await this.db();
    await this.col(db).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role, updatedAt: new Date() } }
    );
  }
}

export const usersRepo = new UsersRepository();
