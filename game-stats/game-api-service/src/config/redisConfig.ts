import { default as Redis } from "ioredis";

export const RedisClient = new Redis(6379, process.env?.REDIS_URL || '192.168.29.171', { connectTimeout: 10000 })