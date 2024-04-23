import { ControllersModule } from '../controllers/controllers.module'
import { DatabaseConnectionModule } from '../database/database.connection.module'
import { EventHandlerModule } from '../event-handler/event.handler.module'
import { EventListenerModule } from '../event-listener/event.listener.module'
import { GatewayModule } from '../gateway/gateway.module'
import { RateLimitModule } from '../rate-limit/rate.limit.module'
import { ResolversModule } from '../resolvers/resolvers.module'
import { ApplicationModule } from '../decorators/ApplicationModule'

@ApplicationModule([
    RateLimitModule,
    DatabaseConnectionModule,
    ControllersModule,
    EventHandlerModule,
    EventListenerModule,
    GatewayModule,
    ResolversModule,
])
export class AppModule {}
