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
import { ApiHeader } from '@nestjs/swagger'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'

@Controller({
    path: 'trainer',
    docTitle: 'Trainer',
})
export class CreateTrainerController
    implements
        ControllerContract<[body: CreateTrainerDTO], CreateTrainerResponse>
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private trainerRepo: TrainerPostgresRepository,
    ) {}

    @Post()
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Body() body: CreateTrainerDTO,
    ): Promise<CreateTrainerResponse> {
        const result = await new ErrorDecorator(
            new CreateTrainerCommand(this.idGen, this.trainerRepo),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
