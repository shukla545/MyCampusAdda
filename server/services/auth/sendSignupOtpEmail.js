const hasBrevoConfig = () => process.env.BREVO_API_KEY && process.env.CONTACT_FROM_EMAIL;

export const sendSignupOtpEmail = async ({ email, name, otp, subject = 'Verify your CampusNest account', heading = 'Verify your CampusNest account', intro = 'use this OTP to verify your email before creating your account:' }) => {
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
        email: process.env.CONTACT_FROM_EMAIL
      },
      to: [{ email, name }],
      subject,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
          <h2>${heading}</h2>
          <p>Hi ${name || 'there'}, ${intro}</p>
          <p style="font-size:28px;font-weight:800;letter-spacing:4px">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Signup OTP email failed: ${text}`);
  }

  return { sent: true, provider: 'brevo' };
};
