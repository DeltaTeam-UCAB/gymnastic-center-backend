import { BarrelModule } from '../decorators/barrel.module'
import { EventHandlerNativeModule } from './native/module/event.handler.native.module'

@BarrelModule([EventHandlerNativeModule])
export class EventHandlerModule {}
