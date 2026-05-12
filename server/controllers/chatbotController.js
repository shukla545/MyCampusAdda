import { asyncHandler } from '../middleware/errorMiddleware.js';
import { detectIntent } from '../services/chatbot/detectIntent.js';
import { fetchRelevantListings } from '../services/chatbot/fetchRelevantListings.js';
import { generateBotAnswer } from '../services/chatbot/generateBotAnswer.js';
import { buildSuggestedActions, fallbackAnswer, unrelatedAnswer } from '../services/chatbot/fallbackAnswer.js';
import User from '../models/User.js';
import { getPublicChatPlans } from './billingController.js';
import { getFreeChatUsed, getRemainingFreeMessages } from '../utils/userAccess.js';

const toRelatedListing = (listing) => ({
  title: listing.title,
  slug: listing.slug,
  type: listing.type,
  priceText: listing.priceText,
  distanceText: listing.distanceText,
  area: listing.area,
  isVerified: listing.isVerified
});

const reserveChatAccess = async (userId) => {
  let user = await User.findById(userId).select('-passwordHash');
  if (!user) return null;

  const freeUsed = getFreeChatUsed(user);
  if (getRemainingFreeMessages(user) > 0) {
    user.freeChatCount = freeUsed + 1;
    user.freeChatUsed = getRemainingFreeMessages(user) <= 0;
    user.lastChatAt = new Date();
    user.totalChatMessages = (user.totalChatMessages || 0) + 1;
    await user.save();
    return { type: 'free', user };
  }

  user = await User.findOneAndUpdate(
    { _id: userId, chatCredits: { $gt: 0 } },
    { $set: { lastChatAt: new Date() }, $inc: { chatCredits: -1, totalChatMessages: 1 } },
    { new: true }
  ).select('-passwordHash');

  if (user) return { type: 'credit', user };
  return null;
};

const toChatUsage = (reservation) => ({
  used: reservation.type,
  freeChatUsed: getRemainingFreeMessages(reservation.user) <= 0,
  freeChatCount: getFreeChatUsed(reservation.user),
  remainingFreeMessages: getRemainingFreeMessages(reservation.user),
  chatCredits: reservation.user.chatCredits || 0,
  totalChatMessages: reservation.user.totalChatMessages || 0
});

export const askChatbot = asyncHandler(async (req, res) => {
  const message = String(req.body.message || '').trim();
  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  const reservation = await reserveChatAccess(req.user._id);
  if (!reservation) {
    res.status(402).json({
      success: false,
      code: 'CHAT_CREDITS_REQUIRED',
      message: 'You used your free AI answers. Please buy chat credits to continue.',
      plans: getPublicChatPlans()
    });
    return;
  }

  const intent = detectIntent(`${message} ${req.body.currentPage || ''}`);
  if (!intent.related) {
    res.json({
      success: true,
      answer: unrelatedAnswer,
      relatedListings: [],
      suggestedActions: [
        { label: 'Explore PGs', path: '/college/thakur-college/pg' },
        { label: 'Explore Mess', path: '/college/thakur-college/mess' }
      ],
      chatUsage: toChatUsage(reservation)
    });
    return;
  }

  if (intent.marketplace) {
    res.json({
      success: true,
      answer: fallbackAnswer({ intent, listings: [] }),
      relatedListings: [],
      suggestedActions: buildSuggestedActions(intent),
      chatUsage: toChatUsage(reservation)
    });
    return;
  }

  if (intent.website && !intent.wantsPG && !intent.wantsMess) {
    res.json({
      success: true,
      answer: 'Yes, logged-in students can contact the CampusNest admin from the Contact page. Your account email is used for the reply.',
      relatedListings: [],
      suggestedActions: [{ label: 'Contact CampusNest', path: '/contact' }],
      chatUsage: toChatUsage(reservation)
    });
    return;
  }

  const { listings, searchMeta } = await fetchRelevantListings({
    intent,
    currentListingSlug: req.body.currentListingSlug
  });
  const answer = await generateBotAnswer({ message, intent, listings, searchMeta });

  res.json({
    success: true,
    answer,
    relatedListings: listings.map(toRelatedListing),
    suggestedActions: buildSuggestedActions(intent),
    chatUsage: toChatUsage(reservation)
  });
});
