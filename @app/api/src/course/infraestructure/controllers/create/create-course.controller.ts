import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { COURSE_ROUTE_PREFIX } from '../prefix'
import { COURSE_DOC_PREFIX } from '../prefix'
import { CreateCourseDTO } from './dto/create-course.dto'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { CreateCourseResponse } from 'src/course/application/commands/createCourse/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateCourseCommand } from 'src/course/application/commands/createCourse/create.course.command'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
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
        private courseRepo: CoursePostgresRepository,
    ) {}

    @Post('create')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateCourseDTO,
    ): Promise<CreateCourseResponse> {
        const result = await new ErrorDecorator(
            new CreateCourseCommand(this.idGen, this.courseRepo),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
