import crypto from 'crypto';
import ChatPayment from '../models/ChatPayment.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

const CHAT_PLANS = [
  { id: 'starter', name: 'Starter', price: 19, amount: 1900, credits: 10, label: '10 AI messages' },
  { id: 'value', name: 'Value', price: 49, amount: 4900, credits: 35, label: '35 AI messages' },
  { id: 'power', name: 'Power', price: 99, amount: 9900, credits: 100, label: '100 AI messages' }
];

const getPlan = (planId) => CHAT_PLANS.find((plan) => plan.id === planId);

export const getPublicChatPlans = () => CHAT_PLANS.map((plan) => ({
  id: plan.id,
  name: plan.name,
  price: plan.price,
  amount: plan.amount,
  credits: plan.credits,
  label: plan.label
}));

const requireRazorpayConfig = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay keys are not configured');
    error.statusCode = 500;
    throw error;
  }
};

const razorpayAuthHeader = () => {
  const token = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  return `Basic ${token}`;
};

const grantCreditsForOrder = async ({ orderId, paymentId, rawPayload }) => {
  const payment = await ChatPayment.findOneAndUpdate(
    { razorpayOrderId: orderId, status: { $ne: 'paid' } },
    {
      status: 'paid',
      razorpayPaymentId: paymentId,
      rawPayload,
      paidAt: new Date()
    },
    { new: true }
  );

  if (!payment) return ChatPayment.findOne({ razorpayOrderId: orderId });

  await User.findByIdAndUpdate(payment.user, { $inc: { chatCredits: payment.credits } });
  return payment;
};

const grantCreditsForQr = async ({ qrCodeId, paymentId, rawPayload }) => {
  const payment = await ChatPayment.findOneAndUpdate(
    { razorpayQrCodeId: qrCodeId, status: { $ne: 'paid' } },
    {
      status: 'paid',
      razorpayPaymentId: paymentId,
      rawPayload,
      paidAt: new Date()
    },
    { new: true }
  );

  if (!payment) return ChatPayment.findOne({ razorpayQrCodeId: qrCodeId });

  await User.findByIdAndUpdate(payment.user, { $inc: { chatCredits: payment.credits } });
  return payment;
};

const grantCreditsForPaymentLink = async ({ paymentLinkId, paymentId, rawPayload }) => {
  const payment = await ChatPayment.findOneAndUpdate(
    { razorpayPaymentLinkId: paymentLinkId, status: { $ne: 'paid' } },
    {
      status: 'paid',
      razorpayPaymentId: paymentId,
      rawPayload,
      paidAt: new Date()
    },
    { new: true }
  );

  if (!payment) return ChatPayment.findOne({ razorpayPaymentLinkId: paymentLinkId });

  await User.findByIdAndUpdate(payment.user, { $inc: { chatCredits: payment.credits } });
  return payment;
};

const postRazorpayPaymentLink = async ({ req, plan, referenceId, upiLink }) => {
  const body = {
    amount: plan.amount,
    currency: 'INR',
    accept_partial: false,
    reference_id: referenceId,
    description: `${plan.name} pack - ${plan.label}`,
    customer: {
      name: req.user.name,
      email: req.user.email
    },
    notify: {
      sms: false,
      email: false
    },
    reminder_enable: false,
    callback_url: process.env.CLIENT_URL || 'http://localhost:5173',
    callback_method: 'get',
    notes: {
      userId: String(req.user._id),
      planId: plan.id,
      credits: String(plan.credits),
      product: 'campus-ai-chat-credits',
      fallbackFrom: 'upi_qr'
    }
  };

  if (upiLink) body.upi_link = true;

  const response = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: {
      Authorization: razorpayAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return {
    response,
    paymentLink: await response.json()
  };
};

const createPaymentLinkFallback = async ({ req, plan, sourceError }) => {
  const baseReferenceId = `chat_${req.user._id}_${plan.id}_${Date.now()}`.slice(0, 34);
  const upiAttempt = await postRazorpayPaymentLink({ req, plan, referenceId: `${baseReferenceId}_u`, upiLink: true });
  const linkAttempt = upiAttempt.response.ok
    ? upiAttempt
    : await postRazorpayPaymentLink({ req, plan, referenceId: `${baseReferenceId}_l`, upiLink: false });

  const { response, paymentLink } = linkAttempt;
  if (!response.ok) {
    return {
      success: false,
      code: 'RAZORPAY_QR_AND_LINK_UNAVAILABLE',
      message: paymentLink.error?.description || sourceError?.description || 'Razorpay UPI QR and payment link are unavailable for this account right now.',
      razorpayError: process.env.NODE_ENV === 'production' ? undefined : {
        qr: sourceError,
        upiPaymentLink: upiAttempt.paymentLink?.error,
        paymentLink: paymentLink.error
      }
    };
  }

  await ChatPayment.create({
    user: req.user._id,
    planId: plan.id,
    credits: plan.credits,
    amount: plan.amount,
    currency: 'INR',
    paymentMode: 'payment_link',
    razorpayOrderId: paymentLink.id,
    razorpayPaymentLinkId: paymentLink.id,
    paymentLinkUrl: paymentLink.short_url,
    status: 'created',
    rawPayload: { source: 'payment_link_fallback_create', paymentLink, qrError: sourceError }
  });

  return {
    success: true,
    mode: 'payment_link',
    notice: upiAttempt.response.ok
      ? 'Razorpay QR Codes API is not active on this account yet, so a UPI payment link was created instead.'
      : 'Razorpay QR/UPI link is not available in this test account, so a hosted Razorpay payment link was created instead.',
    paymentLink: {
      id: paymentLink.id,
      shortUrl: paymentLink.short_url,
      status: paymentLink.status,
      upiLink: Boolean(paymentLink.upi_link)
    },
    plan: {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      amount: plan.amount,
      credits: plan.credits,
      label: plan.label
    }
  };
};

export const getChatPlans = asyncHandler(async (req, res) => {
  res.json({ plans: getPublicChatPlans() });
});

export const createChatCreditOrder = asyncHandler(async (req, res) => {
  requireRazorpayConfig();

  const plan = getPlan(req.body.planId);
  if (!plan) {
    res.status(422);
    throw new Error('Invalid credit plan');
  }

  const receipt = `chat_${req.user._id}_${Date.now()}`.slice(0, 40);
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: razorpayAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: plan.amount,
      currency: 'INR',
      receipt,
      notes: {
        userId: String(req.user._id),
        planId: plan.id,
        credits: String(plan.credits),
        product: 'campus-ai-chat-credits'
      }
    })
  });

  const order = await response.json();
  if (!response.ok) {
    res.status(502);
    throw new Error(order.error?.description || 'Could not create Razorpay order');
  }

  await ChatPayment.create({
    user: req.user._id,
    planId: plan.id,
    credits: plan.credits,
    amount: plan.amount,
    currency: 'INR',
    paymentMode: 'checkout',
    razorpayOrderId: order.id,
    status: 'created'
  });

  res.status(201).json({
    keyId: process.env.RAZORPAY_KEY_ID,
    order,
    plan: {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      credits: plan.credits,
      label: plan.label
    },
    user: {
      name: req.user.name,
      email: req.user.email
    }
  });
});

export const createChatCreditQr = asyncHandler(async (req, res) => {
  requireRazorpayConfig();

  const plan = getPlan(req.body.planId);
  if (!plan) {
    res.status(422);
    throw new Error('Invalid credit plan');
  }

  const closeBy = Math.floor(Date.now() / 1000) + 15 * 60;
  const response = await fetch('https://api.razorpay.com/v1/payments/qr_codes', {
    method: 'POST',
    headers: {
      Authorization: razorpayAuthHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      type: 'upi_qr',
      name: `${plan.name} - CampusNest AI`,
      usage: 'single_use',
      fixed_amount: true,
      payment_amount: plan.amount,
      description: `${plan.name} pack - ${plan.label}`,
      close_by: closeBy,
      notes: {
        userId: String(req.user._id),
        planId: plan.id,
        credits: String(plan.credits),
        product: 'campus-ai-chat-credits'
      }
    })
  });

  const qrCode = await response.json();
  if (!response.ok) {
    const fallback = await createPaymentLinkFallback({ req, plan, sourceError: qrCode.error });
    res.json(fallback);
    return;
  }

  await ChatPayment.create({
    user: req.user._id,
    planId: plan.id,
    credits: plan.credits,
    amount: plan.amount,
    currency: 'INR',
    paymentMode: 'qr',
    razorpayOrderId: qrCode.id,
    razorpayQrCodeId: qrCode.id,
    qrImageUrl: qrCode.image_url,
    qrCloseBy: qrCode.close_by,
    status: 'created',
    rawPayload: { source: 'qr_create', qrCode }
  });

  res.status(201).json({
    success: true,
    mode: 'qr',
    qrCode: {
      id: qrCode.id,
      imageUrl: qrCode.image_url,
      status: qrCode.status,
      closeBy: qrCode.close_by
    },
    plan: {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      amount: plan.amount,
      credits: plan.credits,
      label: plan.label
    }
  });
});

export const verifyChatCreditPayment = asyncHandler(async (req, res) => {
  requireRazorpayConfig();

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;
  if (!orderId || !paymentId || !signature) {
    res.status(422);
    throw new Error('Payment verification details are missing');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expectedSignature !== signature) {
    res.status(400);
    throw new Error('Payment signature verification failed');
  }

  const payment = await ChatPayment.findOne({ razorpayOrderId: orderId, user: req.user._id });
  if (!payment) {
    res.status(404);
    throw new Error('Payment order not found');
  }

  const paidPayment = await grantCreditsForOrder({
    orderId,
    paymentId,
    rawPayload: { source: 'checkout_verify', body: req.body }
  });
  const user = await User.findById(req.user._id).select('-passwordHash');

  res.json({
    success: true,
    message: `${paidPayment.credits} AI messages added`,
    creditsAdded: paidPayment.credits,
    chatCredits: user.chatCredits
  });
});

export const checkChatCreditQrPayment = asyncHandler(async (req, res) => {
  requireRazorpayConfig();

  const qrCodeId = String(req.body.qrCodeId || '').trim();
  if (!qrCodeId) {
    res.status(422);
    throw new Error('QR code id is required');
  }

  const paymentRecord = await ChatPayment.findOne({ razorpayQrCodeId: qrCodeId, user: req.user._id });
  if (!paymentRecord) {
    res.status(404);
    throw new Error('QR payment not found');
  }

  if (paymentRecord.status === 'paid') {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      success: true,
      paid: true,
      message: `${paymentRecord.credits} AI messages already added`,
      creditsAdded: paymentRecord.credits,
      chatCredits: user.chatCredits
    });
    return;
  }

  const response = await fetch(`https://api.razorpay.com/v1/payments/qr_codes/${qrCodeId}/payments?count=10`, {
    headers: {
      Authorization: razorpayAuthHeader()
    }
  });

  const data = await response.json();
  if (!response.ok) {
    res.json({
      success: false,
      paid: false,
      code: 'RAZORPAY_QR_STATUS_UNAVAILABLE',
      message: data.error?.description || 'Could not check QR payment yet',
      razorpayError: process.env.NODE_ENV === 'production' ? undefined : data.error
    });
    return;
  }

  const capturedPayment = (data.items || []).find((item) => item.status === 'captured' && item.amount === paymentRecord.amount);
  if (!capturedPayment) {
    res.json({ success: true, paid: false, message: 'Waiting for QR payment confirmation' });
    return;
  }

  const paidPayment = await grantCreditsForQr({
    qrCodeId,
    paymentId: capturedPayment.id,
    rawPayload: { source: 'qr_status_check', response: data, payment: capturedPayment }
  });
  const user = await User.findById(req.user._id).select('-passwordHash');

  res.json({
    success: true,
    paid: true,
    message: `${paidPayment.credits} AI messages added`,
    creditsAdded: paidPayment.credits,
    chatCredits: user.chatCredits
  });
});

export const checkChatCreditPaymentLink = asyncHandler(async (req, res) => {
  requireRazorpayConfig();

  const paymentLinkId = String(req.body.paymentLinkId || '').trim();
  if (!paymentLinkId) {
    res.status(422);
    throw new Error('Payment link id is required');
  }

  const paymentRecord = await ChatPayment.findOne({ razorpayPaymentLinkId: paymentLinkId, user: req.user._id });
  if (!paymentRecord) {
    res.status(404);
    throw new Error('Payment link not found');
  }

  if (paymentRecord.status === 'paid') {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      success: true,
      paid: true,
      message: `${paymentRecord.credits} AI messages already added`,
      creditsAdded: paymentRecord.credits,
      chatCredits: user.chatCredits
    });
    return;
  }

  const response = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
    headers: {
      Authorization: razorpayAuthHeader()
    }
  });

  const paymentLink = await response.json();
  if (!response.ok) {
    res.json({
      success: false,
      paid: false,
      code: 'RAZORPAY_PAYMENT_LINK_STATUS_UNAVAILABLE',
      message: paymentLink.error?.description || 'Could not check payment link yet',
      razorpayError: process.env.NODE_ENV === 'production' ? undefined : paymentLink.error
    });
    return;
  }

  if (paymentLink.status !== 'paid' && (paymentLink.amount_paid || 0) < paymentRecord.amount) {
    res.json({ success: true, paid: false, message: 'Waiting for payment confirmation' });
    return;
  }

  const capturedPayment = (paymentLink.payments || []).find((item) => item.status === 'captured') || paymentLink.payments?.[0];
  const paidPayment = await grantCreditsForPaymentLink({
    paymentLinkId,
    paymentId: capturedPayment?.payment_id || capturedPayment?.id,
    rawPayload: { source: 'payment_link_status_check', paymentLink }
  });
  const user = await User.findById(req.user._id).select('-passwordHash');

  res.json({
    success: true,
    paid: true,
    message: `${paidPayment.credits} AI messages added`,
    creditsAdded: paidPayment.credits,
    chatCredits: user.chatCredits
  });
});

export const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(500);
    throw new Error('Razorpay webhook secret is not configured');
  }

  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;
  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');

  if (expectedSignature !== signature) {
    res.status(400);
    throw new Error('Invalid Razorpay webhook signature');
  }

  const event = JSON.parse(body.toString('utf8'));
  const orderId = event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id;
  const paymentId = event.payload?.payment?.entity?.id;
  const paymentLinkId = event.payload?.payment_link?.entity?.id;

  if (['payment.captured', 'order.paid'].includes(event.event) && orderId) {
    await grantCreditsForOrder({ orderId, paymentId, rawPayload: event });
  }
  if (event.event === 'payment_link.paid' && paymentLinkId) {
    await grantCreditsForPaymentLink({ paymentLinkId, paymentId, rawPayload: event });
  }

  res.json({ ok: true });
});
