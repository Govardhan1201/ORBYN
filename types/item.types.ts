import { ObjectId } from 'mongodb';

export type ItemType = 'link' | 'pdf' | 'note' | 'image' | 'video' | 'reel' | 'other';
export type ItemVisibility = 'private' | 'link' | 'public_meta' | 'public';
export type GlowState = 'none' | 'blue' | 'gold' | 'green' | 'purple' | 'red';

export interface TopicScore {
  itemCount: number;
  userCount: number;
  publicItemCount: number;
  usageCount: number;
  centrality: number;
  trending: number;
  importance: number;
}

export interface ItemMeta {
  description?: string;
  domain?: string;
  favicon?: string;
  previewImage?: string;
  pageCount?: number;
  duration?: number;
  platform?: string;
  creator?: string;
  transcript?: string;
  ocrText?: string;
  wordCount?: number;
  language?: string;
  richText?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ItemAI {
  summary?: string;
  summaryModel?: string;
  summaryGeneratedAt?: Date;
  keyPoints?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
  confidence?: number;
  similarItemIds?: ObjectId[];
}

export interface ItemTopics {
  primary?: ObjectId;
  secondary: ObjectId[];
  tags: string[];
  userTags: string[];
  locked: boolean;
  confidence: number;
}

export interface ItemScore {
  relevance: number;
  usageCount: number;
  lastViewed?: Date;
  pinned: boolean;
  archived: boolean;
}

export interface ItemModeration {
  reported: boolean;
  reportCount: number;
  flaggedLowQuality: boolean;
  approved: boolean;
}

export interface Item {
  _id: ObjectId;
  userId: ObjectId;
  type: ItemType;
  title: string;
  url?: string;
  filePath?: string;
  filePublicId?: string;
  meta: ItemMeta;
  ai: ItemAI;
  topics: ItemTopics;
  visibility: ItemVisibility;
  score: ItemScore;
  moderation: ItemModeration;
  relatedItems: ObjectId[];
  projectIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemDTO {
  _id: string;
  userId: string;
  type: ItemType;
  title: string;
  url?: string;
  filePath?: string;
  filePublicId?: string;
  meta: ItemMeta;
  ai: ItemAI;
  topics: {
    primary?: string;
    secondary: string[];
    tags: string[];
    userTags: string[];
    locked: boolean;
    confidence: number;
  };
  visibility: ItemVisibility;
  score: ItemScore;
  moderation: ItemModeration;
  relatedItems: string[];
  projectIds: string[];
  primaryTopic?: { _id: string; name: string; slug: string; domain: string; glowState: GlowState };
  createdAt: string;
  updatedAt: string;
}

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  link: 'Link / Webpage',
  pdf: 'PDF / Document',
  note: 'Note',
  image: 'Photo / Image',
  video: 'Video',
  reel: 'Reel / Short',
  other: 'Other',
};

export const ITEM_TYPE_COLORS: Record<ItemType, string> = {
  link: '#3b82f6',
  pdf: '#ef4444',
  note: '#f59e0b',
  image: '#a855f7',
  video: '#ec4899',
  reel: '#f97316',
  other: '#6b7280',
};
