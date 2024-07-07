import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { FindTrainerResponse } from 'src/trainer/application/queries/find/types/response'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { FindTrainerQuery } from 'src/trainer/application/queries/find/find.trainer.query'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/application/models/user'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ImagePostgresByTrainerRepository } from '../../repositories/postgres/image.repository'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
    bearerAuth: true,
})
export class FindTrainerController
implements
        ControllerContract<[param: string, user: User], FindTrainerResponse>
{
    constructor(
        private trainerRepo: TrainerPostgresRepository,
        private imageRepository: ImagePostgresByTrainerRepository,
    ) {}

    @Get('one/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: User,
    ): Promise<FindTrainerResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new FindTrainerQuery(this.trainerRepo, this.imageRepository),
                new NestLogger('FindTrainer'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            userId: user.id,
            trainerId: param,
        })
        return result.unwrap()
    }
}
