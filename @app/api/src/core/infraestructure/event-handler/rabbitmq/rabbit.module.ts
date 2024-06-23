import { ServiceModule } from '../../decorators/service.module'
import { RabbitMQEventHandler } from './rabbit.service'

@ServiceModule([RabbitMQEventHandler])
export class RabbitMQModule {}
