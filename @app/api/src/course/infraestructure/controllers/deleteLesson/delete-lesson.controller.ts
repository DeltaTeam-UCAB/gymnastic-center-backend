import { Delete, HttpException, Param, UseGuards } from '@nestjs/common'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { ApiHeader } from '@nestjs/swagger'
import { LESSON_DOC_PREFIX, LESSON_ROUTE_PREFIX } from '../prefix'
import { LessonPostgresRepository } from '../../repositories/postgres/lesson.repository'
import { DeleteLessonResponse } from 'src/course/application/commands/deleteLesson/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { DeleteLessonCommand } from 'src/course/application/commands/deleteLesson/delete.lesson.command'

@Controller({
    path: LESSON_ROUTE_PREFIX,
    docTitle: LESSON_DOC_PREFIX,
})
export class deleteLessonController
    implements
        ControllerContract<
            [id: string],
            {
                id: string
            }
        >
{
    constructor(
        private lessonRepo: LessonPostgresRepository,
    ) {}

    @Delete('lessons/:id')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@Param('id') id: string): Promise<DeleteLessonResponse> {
        const result = await new ErrorDecorator(
            new DeleteLessonCommand(this.lessonRepo),
            (e) => new HttpException(e.message, 400),
        ).execute(id)
        return result.unwrap()
    }
}
