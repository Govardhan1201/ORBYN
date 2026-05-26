// Feature flags - set via environment variables or admin panel
export const FEATURE_FLAGS = {
  // Phase 1 - Always on
  PERSONAL_GRAPH: true,
  MULTI_MEDIA_INGEST: true,
  TOPIC_ENGINE: true,
  PROJECTS: true,
  THEMES: true,
  KEYWORD_SEARCH: true,

  // Phase 2 - AI/Intelligence layer
  ENABLE_AI: process.env.NEXT_PUBLIC_ENABLE_AI === 'true' || !!process.env.GEMINI_API_KEY,
  ENABLE_OCR: process.env.NEXT_PUBLIC_ENABLE_OCR === 'true',
  ENABLE_DIGEST: process.env.NEXT_PUBLIC_ENABLE_DIGEST !== 'false',
  ENABLE_BULK_IMPORT: process.env.NEXT_PUBLIC_ENABLE_BULK === 'true',
  ENABLE_GAMIFICATION: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION !== 'false',

  // Phase 3 - Public graph
  ENABLE_PUBLIC_GRAPH: process.env.NEXT_PUBLIC_ENABLE_PUBLIC_GRAPH === 'true',
  ENABLE_MODERATION: process.env.NEXT_PUBLIC_ENABLE_MODERATION === 'true',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag];
}
