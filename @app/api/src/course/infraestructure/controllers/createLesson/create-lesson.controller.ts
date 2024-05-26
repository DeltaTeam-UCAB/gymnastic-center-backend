import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { LESSON_ROUTE_PREFIX } from '../prefix'
import { LESSON_DOC_PREFIX } from '../prefix'
import { CreateLessonDTO } from './dto/create-lesson.dto'
import { LessonPostgresRepository } from '../../repositories/postgres/lesson.repository'
import { CreateLessonResponse } from 'src/course/application/commands/createLesson/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateLessonCommand } from 'src/course/application/commands/createLesson/create.lesson.command'

@Controller({
    path: LESSON_ROUTE_PREFIX,
    docTitle: LESSON_DOC_PREFIX,
})
export class CreateLessonController
    implements
        ControllerContract<
            [body: CreateLessonDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private lessonRepo: LessonPostgresRepository,
    ) {}

    @Post('create')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateLessonDTO,
    ): Promise<CreateLessonResponse> {
        const result = await new ErrorDecorator(
            new CreateLessonCommand(this.idGen, this.lessonRepo),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
