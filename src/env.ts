import 'dotenv/config';
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  GOOGLE_PROJECT_ID: z.string(),
  GOOGLE_PRIVATE_KEY_ID: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_AUTH_URI: z.string(),
  GOOGLE_TOKEN_URI: z.string(),
  GOOGLE_AUTH_PROVIDER_CERT_URL: z.string(),
  GOOGLE_CLIENT_CERT_URL: z.string(),
  GOOGLE_UNIVERSE_DOMAIN: z.string()
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables.", _env.error.format());
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
