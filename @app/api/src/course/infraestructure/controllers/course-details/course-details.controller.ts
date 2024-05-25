import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
//import { TrainerPostgresRepository } from 'src/trainer/infraestructure/repositories/postgres/trainer.repository'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { UserGuard } from 'src/client/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ImagePostgresRepository } from 'src/image/infraestructure/repositories/postgres/image.repository'
import { GetCourseDetailsQuery } from 'src/course/application/queries/courseDetails/get.courseDetails.query'
import { courseDetailsResponse } from 'src/course/application/queries/courseDetails/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class CourseDetailsController
    implements ControllerContract<[id: string], courseDetailsResponse>
{
    constructor(
        private courseRepo: CoursePostgresRepository,
        private imageRepo: ImagePostgresRepository,
    ) {}
    @Get('details/:id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<courseDetailsResponse> {
        const result = await new ErrorDecorator(
            new GetCourseDetailsQuery(this.courseRepo, this.imageRepo),
            (e) => new HttpException(e.message, 400),
        ).execute({
            courseId: id,
        })

        return result.unwrap()
    }
}
