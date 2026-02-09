import { Request, Response, NextFunction } from 'express';

/**
 * API Key authentication middleware.
 * Set AGENTS_API_KEY env var to enable. If not set, all requests are allowed (dev mode).
 */
export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const requiredKey = process.env.AGENTS_API_KEY;

  // If no key configured, allow all (dev mode)
  if (!requiredKey) {
    return next();
  }

  const providedKey =
    req.headers['x-api-key'] as string ||
    req.headers['authorization']?.replace('Bearer ', '') ||
    (req.query.apiKey as string);

  if (!providedKey || providedKey !== requiredKey) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required. Pass via x-api-key header, Authorization: Bearer <key>, or ?apiKey= query param.',
    });
    return;
  }

  next();
}

/**
 * Simple in-memory rate limiter.
 * No external dependency — good enough for a single-process server.
 */
export function rateLimiter(opts: {
  windowMs?: number;
  maxRequests?: number;
} = {}) {
  const windowMs = opts.windowMs ?? 60_000; // 1 minute
  const maxRequests = opts.maxRequests ?? 60;  // 60 req/min

  const hits = new Map<string, { count: number; resetAt: number }>();

  // Cleanup stale entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of hits) {
      if (now > val.resetAt) hits.delete(key);
    }
  }, 5 * 60_000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count++;

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > maxRequests) {
      res.status(429).json({
        error: 'Too Many Requests',
        retryAfterMs: entry.resetAt - now,
      });
      return;
    }

    next();
  };
}

/**
 * Request logger middleware.
 */
export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, url } = req;

  _res.on('finish', () => {
    const duration = Date.now() - start;
    const status = _res.statusCode;
    const level = status >= 500 ? 'ERROR' : status >= 400 ? 'WARN' : 'INFO';
    console.log(`[${level}] ${method} ${url} → ${status} (${duration}ms)`);
  });

  next();
}
