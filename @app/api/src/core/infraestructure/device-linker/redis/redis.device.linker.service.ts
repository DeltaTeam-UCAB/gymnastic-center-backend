import { Optional } from '@mono/types-utils'
import { redisClient } from '../../cache/redis/redis.client'
import { DeviceLinker } from '../device.linker'

export class RedisDeviceLinker implements DeviceLinker {
    async link(userId: string, token: string): Promise<void> {
        await redisClient.set('link-device:' + userId, token)
    }

    async isLinked(userId: string, token: string): Promise<boolean> {
        const data = await redisClient.get('link-device:' + userId)
        return data === token
    }

    async getByUser(userId: string): Promise<Optional<string>> {
        const data = await redisClient.get('link-device:' + userId)
        return data ? data : null
    }
}
