import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config';

// Server-side initialization per Google AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client, will use local intelligent analytics fallback:', err);
  }
}

export interface AnonymizedTransaction {
  category: string;
  amount: number;
  date: string;
}

export interface SpendingInsightsPayload {
  transactions: AnonymizedTransaction[];
  limits: {
    daily: number;
    categories?: Record<string, number>;
  };
  spentToday: number;
  balance: number;
}

export interface SpendingInsightsResult {
  weeklySummary: string;
  topSpendingCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  savingSuggestion: string;
  limitWarning: string;
  healthScore: number;
}

export async function generateSpendingInsights(payload: SpendingInsightsPayload): Promise<SpendingInsightsResult> {
  const { transactions = [], limits, spentToday = 0, balance = 0 } = payload;

  // Calculate local aggregate statistics
  const categoryTotals: Record<string, number> = {};
  let totalSpent = 0;
  transactions.forEach((tx) => {
    if (tx.amount > 0) {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      totalSpent += tx.amount;
    }
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => ({
      category: cat,
      amount: amt,
      percentage: totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0,
    }));

  if (aiClient) {
    try {
      const prompt = `
Analyze the following anonymized teen allowance spending for this week:
- Total spent: ₹${totalSpent}
- Current wallet balance: ₹${balance}
- Spent today: ₹${spentToday} out of daily limit ₹${limits.daily}
- Category breakdowns: ${JSON.stringify(sortedCategories)}
- Per-category limits: ${JSON.stringify(limits.categories || {})}
- Total transactions count: ${transactions.length}

Generate a friendly, educational, positive spending insight summary tailored for a high school teen in India learning smart money habits.
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a smart, encouraging financial mentor for Indian teens using PocketSafe. You never mention personal identifiers. Give actionable, concise tips in Indian Rupees (₹).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              weeklySummary: {
                type: Type.STRING,
                description: 'A 1-2 sentence friendly summary of recent spend trend',
              },
              topSpendingCategories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    percentage: { type: Type.NUMBER },
                  },
                  required: ['category', 'amount', 'percentage'],
                },
              },
              savingSuggestion: {
                type: Type.STRING,
                description: 'One realistic, positive money-saving tip for a teen',
              },
              limitWarning: {
                type: Type.STRING,
                description: 'A status alert or praise on adhering to daily and category limits',
              },
              healthScore: {
                type: Type.NUMBER,
                description: 'Financial wellness score between 50 and 98',
              },
            },
            required: ['weeklySummary', 'topSpendingCategories', 'savingSuggestion', 'limitWarning', 'healthScore'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim()) as SpendingInsightsResult;
        return parsed;
      }
    } catch (apiError) {
      console.warn('Gemini generateContent error, falling back to local computation:', apiError);
    }
  }

  // Local fallback heuristics
  const topCat = sortedCategories[0]?.category || 'General';
  const dailyPercent = limits.daily > 0 ? Math.round((spentToday / limits.daily) * 100) : 0;
  
  let warning = 'You are comfortably within your daily spending allowance.';
  if (dailyPercent >= 80) {
    warning = `Warning: You have utilized ${dailyPercent}% of your ₹${limits.daily} daily limit today. Save remaining balance for essentials.`;
  } else if (dailyPercent > 50) {
    warning = `You have spent ₹${spentToday} today (${dailyPercent}% of daily allowance). Good pacing so far!`;
  }

  let suggestion = 'Try putting aside 15% of your weekly allowance into savings before planning leisure spending.';
  if (topCat === 'Food') {
    suggestion = 'Food & snacks took the biggest share this week. Packing a snack from home twice a week can save ₹200+!';
  } else if (topCat === 'Entertainment') {
    suggestion = 'Entertainment is your highest spend. Consider exploring free campus sports or group gaming to stretch your funds.';
  } else if (topCat === 'Shopping') {
    suggestion = 'Practicing the 24-hour rule before buying non-essential items can help you retain your allowance for longer goals.';
  }

  return {
    weeklySummary: `Total spent this period is ₹${totalSpent.toLocaleString('en-IN')}, with ${topCat} being your primary expense. Wallet remains healthy at ₹${balance.toLocaleString('en-IN')}.`,
    topSpendingCategories: sortedCategories.length > 0 ? sortedCategories : [
      { category: 'Food', amount: 350, percentage: 55 },
      { category: 'Travel', amount: 180, percentage: 28 },
      { category: 'Education', amount: 110, percentage: 17 }
    ],
    savingSuggestion: suggestion,
    limitWarning: warning,
    healthScore: Math.min(96, Math.max(65, 92 - Math.floor(dailyPercent / 4))),
  };
}

export async function generateRejectionMessage(payload: {
  amount: number;
  category: string;
  reason: string;
  dailyLimit: number;
  currentBalance: number;
}): Promise<{ message: string }> {
  const { amount, category, reason } = payload;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Draft a 2-sentence warm, loving, constructive guardian note to a teen declining or postponing an extra allowance request of ₹${amount} for "${reason}" in ${category}. Encourage them constructively without harsh language. Mention that their current allowance covers upcoming essentials.`,
        config: {
          systemInstruction:
            'You are an expert parenting advisor specializing in constructive financial communication with Indian teens. Keep it under 40 words, warm, empathetic, and clear.',
        },
      });

      if (response.text) {
        return { message: response.text.trim() };
      }
    } catch (e) {
      console.warn('Gemini rejection message error, using thoughtful fallback:', e);
    }
  }

  return {
    message: `Hi dear, let us discuss this ₹${amount} request over dinner. Let's make sure our scheduled allowance covers your primary school and travel needs first.`,
  };
}
