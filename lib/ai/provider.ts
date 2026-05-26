/**
 * AI Provider Abstraction Layer
 * Swap providers by changing NEXT_PUBLIC_AI_PROVIDER env var.
 * Currently supports: gemini (default)
 */
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

type AIProvider = 'gemini';

const provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'gemini';

let geminiModel: GenerativeModel | null = null;

function getGeminiModel(): GenerativeModel | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!geminiModel) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return geminiModel;
}

export interface AIClassifyResult {
  domain: string;
  topic: string;
  subtopic?: string;
  tags: string[];
  confidence: number;
}

export interface AISummaryResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  model: string;
}

export interface AIRelationResult {
  relatedTopics: string[];
  explanation: string;
}

async function geminiGenerate(prompt: string): Promise<string> {
  const model = getGeminiModel();
  if (!model) throw new Error('Gemini API key not configured');
  const result = await model.generateContent(prompt);
  return result.response.text();
}

function parseJSON<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    const raw = match ? (match[1] || match[0]) : text;
    return JSON.parse(raw.trim()) as T;
  } catch {
    return fallback;
  }
}

export async function aiClassify(
  title: string,
  text: string,
  type: string
): Promise<AIClassifyResult> {
  const defaultResult: AIClassifyResult = {
    domain: 'Other', topic: 'General', tags: [], confidence: 0.3,
  };

  if (provider !== 'gemini' || !process.env.GEMINI_API_KEY) return defaultResult;

  const prompt = `Classify this ${type} into a knowledge domain and topic.

Title: ${title}
Content snippet: ${text.slice(0, 800)}

Respond ONLY with valid JSON matching this schema:
{
  "domain": "one of: Technology, Science, Design, Business, Arts & Culture, Health & Wellness, Education, Philosophy, Current Events, Entertainment, Personal, Other",
  "topic": "specific topic name (2-4 words)",
  "subtopic": "more specific subtopic (optional, 2-4 words)",
  "tags": ["array", "of", "3-6", "relevant", "keywords"],
  "confidence": 0.0-1.0
}`;

  try {
    const raw = await geminiGenerate(prompt);
    return parseJSON(raw, defaultResult);
  } catch {
    return defaultResult;
  }
}

export async function aiSummarize(
  title: string,
  text: string,
  type: string
): Promise<AISummaryResult> {
  const defaultResult: AISummaryResult = {
    summary: '',
    keyPoints: [],
    sentiment: 'neutral',
    model: 'none',
  };

  if (provider !== 'gemini' || !process.env.GEMINI_API_KEY) return defaultResult;

  const prompt = `Summarize this ${type} concisely.

Title: ${title}
Content: ${text.slice(0, 2000)}

Respond ONLY with valid JSON:
{
  "summary": "2-3 sentence summary",
  "keyPoints": ["up to 5 key points"],
  "sentiment": "positive | neutral | negative"
}`;

  try {
    const raw = await geminiGenerate(prompt);
    const parsed = parseJSON<Omit<AISummaryResult, 'model'>>(raw, defaultResult);
    return { ...parsed, model: 'gemini-1.5-flash' };
  } catch {
    return defaultResult;
  }
}

export async function aiSuggestRelated(
  topicName: string,
  existingTopics: string[]
): Promise<AIRelationResult> {
  const defaultResult: AIRelationResult = { relatedTopics: [], explanation: '' };
  if (!process.env.GEMINI_API_KEY) return defaultResult;

  const prompt = `Given the topic "${topicName}", suggest related knowledge topics.
Existing topics: ${existingTopics.slice(0, 20).join(', ')}

Respond ONLY with JSON:
{
  "relatedTopics": ["3-5 related topic names"],
  "explanation": "brief explanation of connections"
}`;

  try {
    const raw = await geminiGenerate(prompt);
    return parseJSON(raw, defaultResult);
  } catch {
    return defaultResult;
  }
}

export async function aiAnswerQuestion(
  question: string,
  context: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return 'AI assistant is not configured. Add your Gemini API key to enable this feature.';
  }

  const prompt = `You are a helpful knowledge graph assistant. Answer this question based on the user's saved knowledge.

Context from their knowledge graph:
${context.slice(0, 3000)}

Question: ${question}

Provide a helpful, concise answer (2-4 sentences). If the context doesn't contain enough information, say so.`;

  try {
    return await geminiGenerate(prompt);
  } catch {
    return 'Unable to generate response. Please try again.';
  }
}

export function isAIAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
