export const TCET_EMAIL_DOMAIN = 'tcetmumbai.in';
export const CHAT_FREE_MESSAGE_LIMIT = 4;

export const isTcetEmail = (email) =>
  String(email || '').trim().toLowerCase().endsWith(`@${TCET_EMAIL_DOMAIN}`);

export const getTcetEmail = (user) => user?.tcetEmail || (isTcetEmail(user?.email) ? user.email : undefined);

export const hasTcetSellerAccess = (user) => Boolean(user?.tcetEmailVerified || isTcetEmail(user?.email));

export const getFreeChatUsed = (user) => {
  const count = Number(user?.freeChatCount);
  if (Number.isFinite(count) && count >= 0) return count;
  return user?.freeChatUsed ? 1 : 0;
};

export const getRemainingFreeMessages = (user) =>
  Math.max(0, CHAT_FREE_MESSAGE_LIMIT - getFreeChatUsed(user));

export const applyTcetEmailIfNeeded = async (user) => {
  if (!user || !isTcetEmail(user.email)) return user;

  const email = String(user.email).trim().toLowerCase();
  if (user.tcetEmailVerified && user.tcetEmail === email) return user;

  const conflict = await user.constructor.exists({ tcetEmail: email, _id: { $ne: user._id } });
  if (conflict) return user;

  user.tcetEmail = email;
  user.tcetEmailVerified = true;
  user.tcetEmailVerifiedAt = user.tcetEmailVerifiedAt || new Date();
  await user.save();
  return user;
};
