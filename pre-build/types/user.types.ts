import { ObjectId } from 'mongodb';

export type UserRole = 'user' | 'admin' | 'moderator';
export type Theme = 'planets' | 'anime' | 'heroic' | 'noir';
export type DefaultView = 'graph' | 'list' | 'timeline';

export interface UserPreferences {
  theme: Theme;
  defaultView: DefaultView;
  defaultPrivacy: 'private' | 'public';
  publicContribution: boolean;
  aiEnabled: boolean;
  digestEnabled: boolean;
  graphMotionIntensity: 'low' | 'medium' | 'high';
  showLabels: boolean;
}

export interface UserStats {
  itemCount: number;
  topicCount: number;
  projectCount: number;
  publicContributions: number;
  streakDays: number;
  lastActive: Date;
  totalViews: number;
}

export interface BadgeRef {
  badgeId: ObjectId;
  earnedAt: Date;
}

export interface User {
  _id: ObjectId;
  email: string;
  emailVerified: boolean;
  passwordHash?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
  stats: UserStats;
  badges: BadgeRef[];
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPublic = Omit<User, 'passwordHash' | 'googleId'>;

export interface UserSession {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  preferences: UserPreferences;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'planets',
  defaultView: 'graph',
  defaultPrivacy: 'private',
  publicContribution: false,
  aiEnabled: true,
  digestEnabled: true,
  graphMotionIntensity: 'medium',
  showLabels: true,
};

export const DEFAULT_STATS: UserStats = {
  itemCount: 0,
  topicCount: 0,
  projectCount: 0,
  publicContributions: 0,
  streakDays: 0,
  lastActive: new Date(),
  totalViews: 0,
};
