import { Delete, HttpException, Param, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Lesson } from '../../models/postgres/lesson.entity'
import { Repository } from 'typeorm'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'

@Controller({
    path: 'course',
    docTitle: 'Course',
})
export class deleteLessonController {
    constructor(
        //@Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    ) {}

    @Delete('lessons/:id') // Route with ID parameter
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async delete(@Param('id') id: string) {
        const lesson = await this.lessonRepo.findOneBy({ id })
        if (!lesson) {
            throw new HttpException('Lesson not found', 404)
        }
        await this.lessonRepo.delete(lesson.id) // Delete the lesson object
        return { message: 'Lesson deleted successfully' } // Optional success message
    }
}
