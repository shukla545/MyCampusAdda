const getAdminContactEmail = () => process.env.CONTACT_ADMIN_EMAIL || process.env.ADMIN_EMAIL || process.env.CONTACT_FROM_EMAIL || '';

const getSenderEmail = () => process.env.CONTACT_FROM_EMAIL || process.env.ADMIN_EMAIL || '';
const hasBrevoConfig = () => Boolean(process.env.BREVO_API_KEY && getSenderEmail() && getAdminContactEmail());

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const sendAdminContactEmail = async ({ contactMessage }) => {
  if (!hasBrevoConfig()) {
    return { sent: false, provider: 'dev', to: getAdminContactEmail() };
  }

  const senderEmail = getSenderEmail();
  const adminEmail = getAdminContactEmail();
  const senderName = process.env.CONTACT_FROM_NAME || 'Team CampusNest';
  const userEmail = contactMessage.email;
  const userName = contactMessage.name || 'CampusNest user';
  const subject = contactMessage.subject || 'CampusNest support message';

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail
      },
      to: [{ email: adminEmail, name: 'CampusNest Admin' }],
      replyTo: userEmail ? { email: userEmail, name: userName } : undefined,
      subject: `[CampusNest Contact] ${subject}`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
          <h2>New CampusNest contact message</h2>
          <p><strong>Name:</strong> ${escapeHtml(userName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(userEmail)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0" />
          <div style="white-space:pre-wrap">${escapeHtml(contactMessage.message)}</div>
        </div>
      `
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Admin contact email failed: ${text}`);
  }

  return { sent: true, provider: 'brevo', to: adminEmail };
};
