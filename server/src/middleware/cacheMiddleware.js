import { createClient } from 'redis';

let redisClient = null;
let isRedisConnected = false;

// Fallback in-memory cache
const memoryCache = new Map();

// Initialize Redis if REDIS_URL is provided
if (process.env.REDIS_URL) {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.warn('⚠️ Redis Client Error, falling back to In-Memory Cache:', err.message);
      isRedisConnected = false;
    });

    redisClient.on('connect', () => {
      console.log('✅ Connected to Redis Cache Server successfully.');
      isRedisConnected = true;
    });

    await redisClient.connect().catch((err) => {
      console.warn('⚠️ Redis Connection failed on startup, using In-Memory Fallback:', err.message);
      isRedisConnected = false;
    });
  } catch (err) {
    console.warn('⚠️ Failed to initialize Redis client, using In-Memory Fallback:', err.message);
    isRedisConnected = false;
  }
} else {
  console.log('💡 No REDIS_URL found. Utilizing high-performance In-Memory cache fallback.');
}

/**
 * Express middleware to cache GET requests.
 * @param {number} ttl - Time-to-live in seconds
 */
export const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      if (isRedisConnected && redisClient) {
        const cachedData = await redisClient.get(key);
        if (cachedData) {
          // Serve from Redis Cache
          return res.json(JSON.parse(cachedData));
        }
      } else {
        const cachedItem = memoryCache.get(key);
        if (cachedItem) {
          if (Date.now() < cachedItem.expiry) {
            // Serve from In-Memory Cache
            return res.json(cachedItem.data);
          } else {
            // Cache expired
            memoryCache.delete(key);
          }
        }
      }

      // Override res.json to capture response data
      const originalJson = res.json;
      res.json = function (body) {
        res.json = originalJson;
        
        // Cache the body before sending it
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (isRedisConnected && redisClient) {
            redisClient.setEx(key, ttl, JSON.stringify(body)).catch((err) => {
              console.error('Failed to set Redis cache key:', err.message);
            });
          } else {
            memoryCache.set(key, {
              data: body,
              expiry: Date.now() + (ttl * 1000)
            });
          }
        }

        return originalJson.call(this, body);
      };

      next();
    } catch (err) {
      console.warn('⚠️ Cache middleware error, skipping cache:', err.message);
      next();
    }
  };
};

/**
 * Invalidates cache by pattern (e.g. invalidates all "/api/products" keys)
 * @param {string} pattern - Key prefix/pattern to delete
 */
export const invalidateCache = async (pattern = 'products') => {
  try {
    const keyPattern = `cache:*${pattern}*`;

    if (isRedisConnected && redisClient) {
      const keys = await redisClient.keys(keyPattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
        console.log(`🧹 Invalidated ${keys.length} cached keys in Redis matching: ${pattern}`);
      }
    } else {
      let count = 0;
      for (const key of memoryCache.keys()) {
        if (key.includes(pattern)) {
          memoryCache.delete(key);
          count++;
        }
      }
      if (count > 0) {
        console.log(`🧹 Invalidated ${count} In-Memory cached keys matching: ${pattern}`);
      }
    }
  } catch (err) {
    console.error('⚠️ Invalidation error:', err.message);
  }
};
