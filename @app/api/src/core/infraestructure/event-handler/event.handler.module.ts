import { BarrelModule } from '../decorators/barrel.module'
import { EventHandlerNativeModule } from './native/module/event.handler.native.module'
import { RabbitMQModule } from './rabbitmq/rabbit.module'

@BarrelModule([EventHandlerNativeModule, RabbitMQModule])
export class EventHandlerModule {}
