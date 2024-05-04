import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { CreateLessonDTO } from './dto/create-lesson.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { Lesson } from '../../models/postgres/lesson.entity'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Repository } from 'typeorm'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'

@Controller({
    path: 'lesson',
    docTitle: 'Lesson',
})
export class createLessonController
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
        @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    ) {}

    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@Body() body: CreateLessonDTO): Promise<{ id: string }> {
        const possibleLesson = await this.lessonRepo.findOneBy({
            name: body.name,
        })
        if (possibleLesson) throw new HttpException('Wrong credentials', 400)
        const lessonId = this.idGen.generate()
        await this.lessonRepo.save({
            id: lessonId,
            ...body,
        })
        return {
            id: lessonId,
        }
    }
}
