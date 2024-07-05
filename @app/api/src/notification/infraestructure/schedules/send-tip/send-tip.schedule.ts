import { Inject, Injectable } from '@nestjs/common'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Cron, CronExpression } from '@nestjs/schedule'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NotificationDecorator } from 'src/notification/application/commands/create/decorators/notification.decorator'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { FirebaseNotificationManager } from '../../firebase/firebase.notification.manager'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ClientPostgresByNotificationRepository } from '../../repositories/postgres/client.repository'
import { ComunicateTipPolicy } from 'src/notification/application/policies/training-tips/training.tips.policy'
import { tips } from 'src/notification/application/policies/training-tips/data/tips'

@Injectable()
export class SendTipSchedule {
    constructor(
        private notificationRepository: NotificationPostgresRepository,
        @Inject(UUID_GEN_NATIVE) private uuidGenerator: IDGenerator<string>,
        private clientRepository: ClientPostgresByNotificationRepository,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_NOON)
    async execute() {
        await new ComunicateTipPolicy(
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
            tips[Math.floor(Math.random() * tips.length)],
        ).execute()
    }
}
