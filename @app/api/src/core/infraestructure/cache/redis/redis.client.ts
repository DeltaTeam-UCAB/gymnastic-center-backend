import { Logger } from '@nestjs/common'
import { createClient } from 'redis'

const client = createClient({
    url: process.env.REDIS_URL,
})

await client.connect()
new Logger('Redis startup').log('Redis connected')

export const redisClient = client
