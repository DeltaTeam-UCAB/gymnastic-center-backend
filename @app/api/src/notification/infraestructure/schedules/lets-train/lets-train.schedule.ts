import { Inject, Injectable } from '@nestjs/common'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Cron, CronExpression } from '@nestjs/schedule'
import { LetsTrainPolicy } from 'src/notification/application/policies/lets-train/lets.train.policy'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NotificationDecorator } from 'src/notification/application/commands/create/decorators/notification.decorator'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { FirebaseNotificationManager } from '../../firebase/firebase.notification.manager'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ClientPostgresByNotificationRepository } from '../../repositories/postgres/client.repository'

@Injectable()
export class LetsTrainSchedule {
    constructor(
        private notificationRepository: NotificationPostgresRepository,
        @Inject(UUID_GEN_NATIVE) private uuidGenerator: IDGenerator<string>,
        private clientRepository: ClientPostgresByNotificationRepository,
    ) {}

    @Cron(CronExpression.EVERY_WEEKDAY)
    async execute() {
        await new LetsTrainPolicy(
            new LoggerDecorator(
                new NotificationDecorator(
                    new CreateNotificationCommand(
                        this.uuidGenerator,
                        this.notificationRepository,
                        new ConcreteDateProvider(),
                    ),
                    new FirebaseNotificationManager(),
                ),
                new NestLogger('Create notification'),
            ),
            this.clientRepository,
        ).execute()
    }
}
