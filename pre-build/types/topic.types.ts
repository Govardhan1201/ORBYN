import { ObjectId } from 'mongodb';
import { GlowState, TopicScore } from './item.types';

export interface Topic {
  _id: ObjectId;
  name: string;
  slug: string;
  aliases: string[];
  description?: string;
  domain: string;
  color?: string;
  parentId?: ObjectId;
  childIds: ObjectId[];
  siblingIds: ObjectId[];
  relatedIds: ObjectId[];
  bridgeTo?: ObjectId[];
  isGlobal: boolean;
  createdBy?: ObjectId;
  score: TopicScore;
  glowState: GlowState;
  confidence: number;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TopicNode {
  id: string;
  name: string;
  slug: string;
  domain: string;
  color?: string;
  parentId?: string;
  childIds: string[];
  score: TopicScore;
  glowState: GlowState;
  x?: number;
  y?: number;
  // Graph visualization props
  val?: number;       // node size
  fx?: number;        // fixed x (optional)
  fy?: number;        // fixed y (optional)
}

export interface GraphEdge {
  _id: ObjectId;
  userId?: ObjectId;
  sourceId: ObjectId;
  targetId: ObjectId;
  sourceType: 'topic' | 'item';
  targetType: 'topic' | 'item';
  edgeType: 'parent' | 'child' | 'sibling' | 'related' | 'bridge' | 'co-occurrence';
  weight: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GraphData {
  nodes: TopicNode[];
  links: {
    source: string;
    target: string;
    edgeType: string;
    weight: number;
  }[];
}

export interface TopicHierarchy {
  domain: string;
  topics: TopicWithChildren[];
}

export interface TopicWithChildren extends Topic {
  children: TopicWithChildren[];
  itemCount: number;
}

// System topic taxonomy (pre-seeded)
export const TOPIC_DOMAINS = [
  'Technology',
  'Science',
  'Design',
  'Business',
  'Arts & Culture',
  'Health & Wellness',
  'Education',
  'Philosophy',
  'Current Events',
  'Entertainment',
  'Personal',
  'Other',
] as const;

export type TopicDomain = typeof TOPIC_DOMAINS[number];

export const DOMAIN_COLORS: Record<string, string> = {
  'Technology': '#3b82f6',
  'Science': '#10b981',
  'Design': '#8b5cf6',
  'Business': '#f59e0b',
  'Arts & Culture': '#ec4899',
  'Health & Wellness': '#22c55e',
  'Education': '#06b6d4',
  'Philosophy': '#a855f7',
  'Current Events': '#ef4444',
  'Entertainment': '#f97316',
  'Personal': '#64748b',
  'Other': '#6b7280',
};
