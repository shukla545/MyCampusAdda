import OpenAI from 'openai';
import { disclaimer, fallbackAnswer } from './fallbackAnswer.js';

const hasUsableOpenAIKey = () => {
  const key = process.env.OPENAI_API_KEY;
  return key && !key.startsWith('your_') && key.length > 20;
};

const summarizeListing = (listing) => ({
  title: listing.title,
  type: listing.type,
  price: listing.price,
  priceText: listing.priceText,
  area: listing.area,
  distanceText: listing.distanceText,
  facilities: listing.facilities || [],
  isVerified: listing.isVerified,
  pgDetails: listing.type === 'pg' ? listing.pgDetails : undefined,
  messDetails: listing.type === 'mess' ? listing.messDetails : undefined
});

export const generateBotAnswer = async ({ message, intent, listings, searchMeta }) => {
  if (!hasUsableOpenAIKey()) return fallbackAnswer({ intent, listings, searchMeta });

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_CHATBOT_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: [
            'You are Campus AI Help Bot for MyCampusAdda.',
            'Answer only MyCampusAdda questions about approved PG and Mess listings near Thakur College.',
            'Use only the provided listing summaries and searchMeta. Do not invent listings, prices, facilities, availability, menus, or contact details.',
            'If searchMeta.usedClosestListings is true, clearly say the exact budget match was not found and then suggest closest approved options.',
            'If data is missing, say it is not available.',
            'Never guarantee availability, auto-book, auto-pay, or send WhatsApp messages.',
            'Talk naturally like a helpful campus assistant. Keep answer concise: 3-6 short sentences.'
          ].join(' ')
        },
        {
          role: 'user',
          content: JSON.stringify({
            userMessage: message,
            listings: listings.map(summarizeListing),
            searchMeta,
            requiredDisclaimer: disclaimer
          })
        }
      ]
    });

    const answer = response.output_text?.trim();
    if (!answer) return fallbackAnswer({ intent, listings, searchMeta });
    return answer.includes(disclaimer) ? answer : `${answer} ${disclaimer}`;
  } catch {
    return fallbackAnswer({ intent, listings, searchMeta });
  }
};
