const hasBrevoConfig = () => process.env.BREVO_API_KEY && process.env.CONTACT_FROM_EMAIL;

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const sendReplyEmail = async ({ toEmail, toName, subject, reply, originalMessage }) => {
  if (!hasBrevoConfig()) {
    return { sent: false, provider: 'dev' };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: process.env.CONTACT_FROM_NAME || 'Team CampusNest',
        email: process.env.CONTACT_FROM_EMAIL
      },
      to: [{ email: toEmail, name: toName || undefined }],
      subject: subject || 'Reply from CampusNest',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
          <p>Dear ${escapeHtml(toName || 'student')},</p>
          <div style="white-space:pre-wrap">${escapeHtml(reply)}</div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
          <p style="font-size:13px;color:#64748b">Your message:</p>
          <div style="white-space:pre-wrap;font-size:13px;color:#475569">${escapeHtml(originalMessage)}</div>
          <p style="margin-top:24px">Best Regards,<br/>Team CampusNest</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Reply email failed: ${text}`);
  }

  return { sent: true, provider: 'brevo' };
};
