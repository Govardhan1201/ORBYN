import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongoConnection {
  client: MongoClient;
  db: Db;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoConnection: Promise<MongoConnection> | undefined;
}

async function createConnection(): Promise<MongoConnection> {
  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'orbyn');

  // Create indexes
  await createIndexes(db);

  return { client, db };
}

async function createIndexes(db: Db): Promise<void> {
  try {
    // Users
    await db.collection('users').createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { googleId: 1 }, sparse: true },
      { key: { role: 1 } },
    ]);

    // Items
    await db.collection('items').createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { userId: 1, type: 1 } },
      { key: { userId: 1, 'topics.primary': 1 } },
      { key: { userId: 1, 'score.pinned': 1 } },
      { key: { userId: 1, 'score.archived': 1 } },
      { key: { visibility: 1 } },
      { key: { title: 'text', 'meta.description': 'text', 'ai.summary': 'text', 'topics.tags': 'text' } },
    ]);

    // Topics
    await db.collection('topics').createIndexes([
      { key: { slug: 1 }, unique: true },
      { key: { domain: 1 } },
      { key: { isGlobal: 1 } },
      { key: { parentId: 1 } },
      { key: { 'score.importance': -1 } },
      { key: { name: 'text', aliases: 'text' } },
    ]);

    // Graph edges
    await db.collection('graph_edges').createIndexes([
      { key: { userId: 1, sourceId: 1 } },
      { key: { userId: 1, targetId: 1 } },
      { key: { isPublic: 1, edgeType: 1 } },
    ]);

    // Projects
    await db.collection('projects').createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { userId: 1, status: 1 } },
    ]);

    // Activity events
    await db.collection('activity_events').createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { type: 1, createdAt: -1 } },
    ]);

    // Search history
    await db.collection('search_history').createIndexes([
      { key: { userId: 1, createdAt: -1 } },
      { key: { userId: 1, savedAt: 1 }, sparse: true },
    ]);

  } catch {
    // Indexes may already exist — safe to ignore
  }
}

export async function connectDB(): Promise<MongoConnection> {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoConnection) {
      global._mongoConnection = createConnection();
    }
    return global._mongoConnection;
  }
  return createConnection();
}

export async function getDb(): Promise<Db> {
  const { db } = await connectDB();
  return db;
}

const clientPromise = connectDB().then(conn => conn.client);
export { clientPromise };
export default clientPromise;
