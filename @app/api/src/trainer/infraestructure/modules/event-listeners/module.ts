import { EventListenersModule } from 'src/core/infraestructure/event-listener/decorators/event.listener.module'

@(await EventListenersModule())
export class TrainerEventListenersModule {}
