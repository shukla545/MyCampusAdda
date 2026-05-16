const DEFAULT_CONTACT_EMAIL = 'campusnest.online@gmail.com';

const getSenderEmail = () => process.env.CONTACT_FROM_EMAIL || DEFAULT_CONTACT_EMAIL;
const hasBrevoConfig = () => Boolean(process.env.BREVO_API_KEY);

export const sendOtpEmail = async ({ email, otp }) => {
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
        name: process.env.CONTACT_FROM_NAME || 'CampusNest',
        email: getSenderEmail()
      },
      to: [{ email }],
      subject: 'Your CampusNest contact OTP',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
          <h2>Your CampusNest OTP</h2>
          <p>Use this OTP to verify your email and send a message to the admin:</p>
          <p style="font-size:28px;font-weight:800;letter-spacing:4px">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OTP email failed: ${text}`);
  }

  return { sent: true, provider: 'brevo' };
};
