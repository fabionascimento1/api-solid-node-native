import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  PORT_DATABASE: z.coerce.number().default(3333),
  USER_DATABASE: z.coerce.string().default("admin"),
  HOST: z.coerce.string().default("localhost"),
  DATABASE: z.coerce.string().default("table"),
  PASSWORD: z.coerce.string().default("admin"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
