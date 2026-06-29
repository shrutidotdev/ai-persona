// Simple in-memory rate limiting (counts reset every hour)
// For production, replace with Upstash Redis

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 100 // requests per hour
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let record = rateLimitStore.get(key);
  
  // Reset if hour has passed
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + 3600000, // 1 hour from now
    };
    rateLimitStore.set(key, record);
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: Math.max(0, limit - record.count) };
}

export function getRateLimitHeaders(remaining: number) {
  return {
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Limit": "100",
    "X-RateLimit-Reset": new Date(Date.now() + 3600000).toISOString(),
  };
}
