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
import { UserGuard } from '../../guards/user.guard'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ImagePostgresByTrainerRepository } from '../../repositories/postgres/image.repository'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'
import { CurrentUserResponse } from '../../auth/current/types/response'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
    bearerAuth: true,
})
export class FindTrainerController
implements
        ControllerContract<
            [param: string, user: CurrentUserResponse],
            FindTrainerResponse
        >
{
    constructor(
        private trainerRepo: TrainerPostgresRepository,
        private imageRepository: ImagePostgresByTrainerRepository,
    ) {}

    @Get('one/:id')
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<FindTrainerResponse> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new FindTrainerQuery(
                    this.trainerRepo,
                    new ImageRedisRepositoryProxy(this.imageRepository),
                ),
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
