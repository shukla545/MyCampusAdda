import { asyncHandler } from '../middleware/errorMiddleware.js';

const runAI = async (task, listing) => {
  if (!process.env.OPENAI_API_KEY) {
    return { unavailable: true, message: 'OPENAI_API_KEY is not configured. Add it to server/.env to use admin AI helpers.' };
  }

  const prompt = `${task}\n\nListing details:\n${JSON.stringify(listing, null, 2)}\n\nReturn practical, concise output for a premium student listing platform in Mumbai.`;
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      input: prompt
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${text}`);
  }

  const data = await response.json();
  return { text: data.output_text || 'No AI output returned.' };
};

export const generateDescription = asyncHandler(async (req, res) => {
  res.json(await runAI('Write a warm, polished listing description in 90-130 words.', req.body));
});

export const generateFaqs = asyncHandler(async (req, res) => {
  res.json(await runAI('Generate 5 helpful FAQs as JSON array with question and answer keys.', req.body));
});

export const suggestImprovements = asyncHandler(async (req, res) => {
  res.json(await runAI('Suggest practical improvements for this listing quality, trust, photos, pricing clarity, and conversion.', req.body));
});
