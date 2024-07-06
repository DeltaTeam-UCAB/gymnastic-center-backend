import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CreateTrainerDTO } from './dto/create.trainer.dto'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Body, HttpException, Post, Inject, UseGuards } from '@nestjs/common'
import { CreateTrainerResponse } from 'src/trainer/application/commands/create/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateTrainerCommand } from 'src/trainer/application/commands/create/create.trainer.command'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { AuditDecorator } from 'src/core/application/decorators/audit.decorator'
import { AuditingTxtRepository } from 'src/core/infraestructure/auditing/repositories/txt/auditing.repository'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { CurrentUserResponse } from '../../../../../src/user/application/queries/current/types/response'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
    bearerAuth: true,
})
export class CreateTrainerController
    implements
        ControllerContract<
            [body: CreateTrainerDTO, user: CurrentUserResponse],
            CreateTrainerResponse
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private trainerRepo: TrainerPostgresRepository,
        private eventPublisher: RabbitMQEventHandler,
    ) {}

    @Post()
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateTrainerDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<CreateTrainerResponse> {
        const audit = {
            user: user.id,
            operation: 'Create Trainer',
            succes: true,
            ocurredOn: new Date(Date.now()),
            data: JSON.stringify(body),
        }
        const result = await new ErrorDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new CreateTrainerCommand(
                        this.idGen,
                        this.trainerRepo,
                        this.eventPublisher,
                    ),
                    new NestLogger('CreateTrainer'),
                ),
                new AuditingTxtRepository(),
                audit,
            ),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
