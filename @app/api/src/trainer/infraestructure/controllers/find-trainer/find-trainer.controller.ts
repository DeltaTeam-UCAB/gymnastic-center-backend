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
import { ApiHeader } from '@nestjs/swagger'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
})
export class FindTrainerController
    implements ControllerContract<[param: string], FindTrainerResponse>
{
    constructor(private trainerRepo: TrainerPostgresRepository) {}

    @Get(':id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
    ): Promise<FindTrainerResponse> {
        const result = await new ErrorDecorator(
            new FindTrainerQuery(this.trainerRepo),
            (e) => new HttpException(e.message, 400),
        ).execute(param)
        return result.unwrap()
    }
}
