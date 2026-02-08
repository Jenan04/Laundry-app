import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, 
    },
    tls: {
      rejectUnauthorized: false
    }
});

/**
 * دالة إرسال الـ OTP
 * @param email - إيميل المستخدم المستهدف
 * @param otp - الكود المكون من 6 أرقام
 */
export const sendOTPEmail = async (email: string, otp: string) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error("❌ Mailer Error: GMAIL_USER or GMAIL_PASS is missing in .env");
    throw new Error("MAILER_CONFIG_ERROR");
  }
  const mailOptions = {
    from: `"Yasser's Laundry" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Verification Code - Yasser\'s Laundry',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #733F3F; margin: 0;">Yasser's Laundry</h1>
        </div>
        <div style="padding: 20px; background-color: #fdf6f6; border-radius: 8px; text-align: center;">
          <h2 style="color: #333; margin-top: 0;">Confirm Your Email</h2>
          <p style="color: #666; font-size: 16px;">Thank you for joining us! Please use the following code to verify your account:</p>
          <div style="margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #733F3F; letter-spacing: 8px; border: 2px dashed #D6B2B2; padding: 10px 25px; border-radius: 8px; display: inline-block; background: #fff;">
              ${otp}
            </span>
          </div>
          <p style="color: #999; font-size: 13px;">This code is valid for <b>5 minutes</b> only.</p>
        </div>
        <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 25px;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    console.log(`⏳ Attempting to send email to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('FAILED_TO_SEND_EMAIL');
  }
};