import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { DeleteTrainerResponse } from 'src/trainer/application/commands/delete/types/response'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import {
    Delete,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { DeleteTrainerCommand } from 'src/trainer/application/commands/delete/delete.trainer.command'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
    bearerAuth: true,
})
export class DeleteTrainerController
    implements ControllerContract<[id: string], DeleteTrainerResponse>
{
    constructor(
        private trainerRepository: TrainerPostgresRepository,
        private eventPublisher: RabbitMQEventHandler,
    ) {}

    @Delete('one/:id')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<DeleteTrainerResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new DomainErrorParserDecorator(
                    new DeleteTrainerCommand(
                        this.trainerRepository,
                        this.eventPublisher,
                    ),
                ),
                new NestLogger('Delete Trainer'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            id,
        })
        return result.unwrap()
    }
}
