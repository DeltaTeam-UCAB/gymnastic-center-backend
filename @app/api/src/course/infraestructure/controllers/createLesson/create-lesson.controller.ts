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
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { ApiHeader } from '@nestjs/swagger'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
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

    @Post('create-lesson')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@Body() body: CreateLessonDTO): Promise<{ id: string }> {
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
