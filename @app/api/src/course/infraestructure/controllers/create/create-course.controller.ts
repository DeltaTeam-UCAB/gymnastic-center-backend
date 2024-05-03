import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Repository } from 'typeorm'
import { CreateCourseDTO } from './dto/create-course.dto'
import { Course } from '../../models/postgres/course.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'

@Controller({
    path: 'course',
    docTitle: 'Course',
})
export class CreateCourseController
    implements
        ControllerContract<
            [body: CreateCourseDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
    ) {}

    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@Body() body: CreateCourseDTO): Promise<{ id: string }> {
        const possibleCourse = await this.courseRepo.findOneBy({
            title: body.title,
        })
        if (possibleCourse) throw new HttpException('Wrong credentials', 400)
        const courseId = this.idGen.generate()
        const creationDate = new Date()
        await this.courseRepo.save({
            id: courseId,
            createDate: creationDate,
            ...body,
        })
        return {
            id: courseId,
        }
    }
}
