import { ServiceModule } from '../../decorators/service.module'
import { RedisDeviceLinker } from './redis.device.linker.service'

export const REDIS_USER_LINKER = 'REDIS_USER_LINKER'

@ServiceModule([
    {
        provide: REDIS_USER_LINKER,
        useClass: RedisDeviceLinker,
    },
])
export class RedisDeviceLinkerModule {}
