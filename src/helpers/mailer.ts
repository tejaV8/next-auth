import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

type EmailType = "VERIFY" | "RESET";

type SendEmailOptions = {
  email: string;
  emailType: EmailType;
  userId: string;
};

export async function sendEmail({ email, emailType, userId }: SendEmailOptions) {
  const requiredEnvVars = ["MAIL_HOST", "MAIL_USER", "MAIL_PASSWORD", "DOMAIN"];
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing email configuration: ${missingEnvVars.join(", ")}`,
    );
  }

  const hashedToken = await bcryptjs.hash(userId.toString(), 10);
  const tokenUpdate =
    emailType === "VERIFY"
      ? {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        }
      : {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        };

  await User.findByIdAndUpdate(userId, tokenUpdate);

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === "true",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const path = emailType === "VERIFY" ? "verifyemail" : "resetpassword";
  const tokenUrl = `${process.env.DOMAIN}/${path}?token=${encodeURIComponent(
    hashedToken,
  )}`;
  const mailOptions = {
    from: process.env.MAIL_FROM || `Auth App <${process.env.MAIL_USER}>`,
    to: email,
    subject:
      emailType === "VERIFY" ? "Verify your email" : "Reset your password",
    html: `<p>Click <a href="${tokenUrl}">here</a> to ${
      emailType === "VERIFY" ? "verify your email" : "reset your password"
    }.</p>`,
  };

  return transport.sendMail(mailOptions);
}
