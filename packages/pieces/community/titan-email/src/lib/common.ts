import { PieceAuth } from "@activepieces/pieces-framework";
import * as nodemailer from "nodemailer";

export const titanEmailAuth = PieceAuth.CustomAuth({
  displayName: "Titan Email Account",
  description: "Connect your Titan Email account using SMTP credentials.",
  required: true,
  props: {
    email: PieceAuth.SecretText({
      displayName: "Email Address",
      description: "Your full Titan email address (e.g. you@yourdomain.com)",
      required: true,
    }),
    password: PieceAuth.SecretText({
      displayName: "Password",
      description: "Your Titan email account password",
      required: true,
    }),
    smtp_host: PieceAuth.SecretText({
      displayName: "SMTP Host",
      description: "Titan SMTP host (e.g. smtp.titan.email)",
      required: true,
    }),
    smtp_port: PieceAuth.SecretText({
      displayName: "SMTP Port",
      description: "SMTP port — 587 for STARTTLS (recommended) or 465 for SSL",
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      const transporter = createTransporter(auth);
      await transporter.verify();
      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        error: `SMTP connection failed: ${(e as Error).message}`,
      };
    }
  },
});

export type TitanAuth = {
  email: string;
  password: string;
  smtp_host: string;
  smtp_port: string;
};

export function createTransporter(auth: TitanAuth) {
  const port = parseInt(auth.smtp_port, 10);
  return nodemailer.createTransport({
    host: auth.smtp_host,
    port,
    secure: port === 465,
    auth: {
      user: auth.email,
      pass: auth.password,
    },
  });
}
