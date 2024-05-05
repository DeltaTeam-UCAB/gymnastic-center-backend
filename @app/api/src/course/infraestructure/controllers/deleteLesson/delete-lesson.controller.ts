import { Delete, HttpException, Param, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Lesson } from '../../models/postgres/lesson.entity'
import { Repository } from 'typeorm'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { ApiHeader } from '@nestjs/swagger'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
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
        @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    ) {}

    @Delete('lessons/:id')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@Param('id') id: string): Promise<{ id: string }> {
        const lesson = await this.lessonRepo.findOneBy({ id })
        if (!lesson) {
            throw new HttpException('Lesson not found', 404)
        }
        const deleted = lesson.id
        await this.lessonRepo.delete(lesson.id)
        return { id: deleted }
    }
}
