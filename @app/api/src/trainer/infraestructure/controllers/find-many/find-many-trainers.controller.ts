import { Get, HttpException, Query, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { UserGuard } from '../../guards/user.guard'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { FindManyTrainersResponse } from 'src/trainer/application/queries/find-many/types/response'
import { FindManyTrainersQuery } from 'src/trainer/application/queries/find-many/find-many-trainers-query'
import { FindManyTrainersDTO } from './dto/dto'
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
            [data: FindManyTrainersDTO, user: CurrentUserResponse],
            FindManyTrainersResponse[]
        >
{
    constructor(
        private trainerRepo: TrainerPostgresRepository,
        private imageRepository: ImagePostgresByTrainerRepository,
    ) {}

    @Get('many')
    @UseGuards(UserGuard)
    async execute(
        @Query() data: FindManyTrainersDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<FindManyTrainersResponse[]> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new FindManyTrainersQuery(
                    this.trainerRepo,
                    new ImageRedisRepositoryProxy(this.imageRepository),
                ),
                new NestLogger('FindManyTrainers'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            userId: user.id,
            page: data.page,
            perPage: data.perPage,
            filterByFollowed: data.filterByFollowed,
        })
        return result.unwrap()
    }
}
