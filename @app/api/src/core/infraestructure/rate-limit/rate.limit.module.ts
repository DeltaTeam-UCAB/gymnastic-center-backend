import { ThrottlerModule } from '@nestjs/throttler'
import { ConfigurationModule } from '../decorators/config.module.decorator'

@ConfigurationModule([
    ThrottlerModule.forRoot({
        ttl: 60,
        limit: 10,
    }),
])
export class RateLimitModule {}
