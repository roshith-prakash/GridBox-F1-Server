import { createClient } from 'redis';

// Create redis client
export const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port:  Number(process.env.REDIS_PORT) 
    }
});

// Connect client to db
await redisClient.connect()