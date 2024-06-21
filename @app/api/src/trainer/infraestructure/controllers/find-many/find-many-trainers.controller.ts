import { Get, HttpException, Query, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { TrainerPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/application/models/user'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { FindManyTrainersResponse } from 'src/trainer/application/queries/find-many/types/response'
import { FindManyTrainersQuery } from 'src/trainer/application/queries/find-many/find-many-trainers-query'
import { FindManyTrainersDTO } from './dto/dto'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
})
export class FindTrainerController
    implements
        ControllerContract<
            [data: FindManyTrainersDTO, user: User],
            FindManyTrainersResponse[]
        >
{
    constructor(private trainerRepo: TrainerPostgresRepository) {}

    @Get('many')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query() data: FindManyTrainersDTO,
        @UserDecorator() user: User,
    ): Promise<FindManyTrainersResponse[]> {
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new FindManyTrainersQuery(this.trainerRepo),
                new NestLogger('FindManyTrainers'),
            ),
            (e) => new HttpException(e.message, 400),
        ).execute({
            userId: user.id,
            page: data.page,
            perPage: data.perPage,
            filterByFollowed: data.filterByFollowed === 'true',
        })
        return result.unwrap()
    }
}
