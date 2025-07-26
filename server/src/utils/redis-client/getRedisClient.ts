import { createClient, RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let connecting: Promise<RedisClientType> | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
    if (client) return client;

    if (!connecting) {
        const tempClient: RedisClientType = createClient();

        tempClient.on('error', (err) => console.error('Redis Client Error', err))

        connecting = tempClient.connect().then(() => {
            client = tempClient;
            return client
        })
    }

    return connecting
}

