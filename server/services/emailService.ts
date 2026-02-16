
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail
    pass: process.env.GMAIL_APP_PASS, // Your App Password
  },
});

export const sendAdminReplyEmail = async (userEmail: string, userName: string, subject: string, replyText: string) => {
  const mailOptions = {
    from: `"ES GISHOMA" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: `RE: ${subject} - Official Response`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #4f46e5;">Official School Response</h2>
        <p>Dear ${userName},</p>
        <p>Thank you for contacting ES GISHOMA. Below is the official response to your inquiry regarding "<strong>${subject}</strong>":</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0;">
          ${replyText}
        </div>
        <p style="color: #64748b; font-size: 14px;">If you have further questions, please do not hesitate to reach out.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">
          ES GISHOMA Administration<br />
          123 Academic Way, NY 10001
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
};