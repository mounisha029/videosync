import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1, "Clerk publishable key is required"),
  CLERK_SECRET_KEY: z.string().min(1, "Clerk secret key is required"),
  CLERK_WEBHOOK_SECRET: z.string().min(1, "Clerk webhook secret is required").optional(),

  // Convex
  NEXT_PUBLIC_CONVEX_URL: z.string().url("Invalid Convex URL"),
  CONVEX_DEPLOYMENT: z.string().min(1, "Convex deployment is required").optional(),

  // Stream.io
  NEXT_PUBLIC_STREAM_API_KEY: z.string().min(1, "Stream API key is required"),
  STREAM_SECRET_KEY: z.string().min(1, "Stream secret key is required"),
});

// Validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
      NEXT_PUBLIC_STREAM_API_KEY: process.env.NEXT_PUBLIC_STREAM_API_KEY,
      STREAM_SECRET_KEY: process.env.STREAM_SECRET_KEY,
    });

    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `  - ${err.path.join(".")}: ${err.message}`);
      
      console.error("❌ Invalid environment variables:");
      console.error(missingVars.join("\n"));
      console.error("\n💡 Check your .env.local file and compare with .env.example");
      
      throw new Error("Invalid environment variables. Check console for details.");
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;
