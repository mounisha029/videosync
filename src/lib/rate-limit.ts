// Simple in-memory rate limiter
// For production, use Redis or a dedicated rate limiting service

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests allowed in the time window
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limiter function
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60 * 1000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;

  // Initialize or get existing record
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.interval,
    };
  }

  // Increment count
  store[key].count++;

  const remaining = Math.max(0, config.maxRequests - store[key].count);
  const success = store[key].count <= config.maxRequests;

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: store[key].resetTime,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // API endpoints
  api: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  
  // Authentication endpoints
  auth: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  
  // Interview creation
  createInterview: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 interviews per minute
  },
  
  // Email sending
  sendEmail: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 emails per minute
  },
  
  // General actions
  general: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
};

/**
 * Get client identifier from request
 * Uses IP address or user ID
 */
export function getClientIdentifier(request: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0] || realIp || "unknown";

  return `ip:${ip}`;
}
