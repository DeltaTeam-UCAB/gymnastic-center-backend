import { EventHandlerNative } from '../service/event.hadler.native.service'
import { ServiceModule } from 'src/core/infraestructure/decorators/service.module'

export const EVENT_HANDLER_NATIVE = 'EVENT_HANDLER_NATIVE'

@ServiceModule([
    {
        provide: EVENT_HANDLER_NATIVE,
        useClass: EventHandlerNative,
    },
])
export class EventHandlerNativeModule {}
