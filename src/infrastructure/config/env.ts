import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

export const envSchema = z.object({
   DATABASE_URL: z.string().describe("Database URL"),
   PORT: z.coerce.number().default(3000).describe("Server port"),
   ALLOWED_ORIGINS: z.string().default('*').describe('Allowed origins for CORS (comma-separated)'),
   JWT_SECRET: z.string().describe('Secret to validate JWT tokens'),
   JWT_SECRET_NOACCESS: z.string().describe('Secret for tokens without full access (pre-OTP validation)'),
   JWT_EXPIRES_IN: z.string().default('7d').describe('JWT token expiration time'),
   RESEND_API_KEY: z.string().describe('Resend API key'),
   EMAIL_FROM: z.string().email().describe('Email address to send emails from'),
   MIND_TOKEN: z.string().describe('Mind API Bearer token'),
   ZYONPAY_PUBLIC_KEY: z.string().describe('ZyonPay public key for authentication'),
   ZYONPAY_SECRET_KEY: z.string().describe('ZyonPay secret key for authentication'),
   ZYONPAY_BASE_URL: z.string().default('https://app.hotpayy.com/api/v1').describe('ZyonPay API base URL'),
   ZYONPAY_WEBHOOK_URL: z.string().optional().describe('Webhook URL for payment notifications'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
   console.error("❌ Invalid environment variables", _env.error.format());
   throw new Error("Invalid environment variables");
}

export const env = _env.data