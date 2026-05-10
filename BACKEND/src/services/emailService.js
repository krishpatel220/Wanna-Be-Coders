/**
 * Email service placeholder.
 * Replace with a real provider (SendGrid, Mailgun, AWS SES, Nodemailer, etc.)
 * when ready for production.
 */

/**
 * Send an email.
 *
 * @param {object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 * @returns {Promise<void>}
 */
const sendEmail = async ({ to, subject, text, html }) => {
  // TODO: Integrate a real email provider here
  //
  // Example with Nodemailer:
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ from: 'noreply@app.com', to, subject, text, html });

  console.log(`📧 Email sent (dev mode):`);
  console.log(`   To: ${to}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Body: ${text}`);
};

/**
 * Send a welcome email to a newly registered user.
 */
const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to TravelLoop!',
    text: `Hi ${user.name}, welcome to TravelLoop! We're excited to have you on board.`,
  });
};

/**
 * Send a password reset email.
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request (valid for 10 minutes)',
    text: `Forgot your password? Submit a PATCH request to: ${resetUrl}\nIf you didn't request this, please ignore this email.`,
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendPasswordResetEmail };
