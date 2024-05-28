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
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { UserGuard } from 'src/client/infraestructure/guards/user.guard'
import { GetCourseDetailsQuery } from 'src/course/application/queries/courseDetails/get.courseDetails.query'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { VideoPostgresByCourseRepository } from '../../repositories/postgres/video.repository'
import { TrainerPostgresByCourseRepository } from '../../repositories/postgres/trainer.repository'
import { CategoryPostgresByCourseRepository } from '../../repositories/postgres/category.repository'
import { GetCourseDetailsResponse } from 'src/course/application/queries/courseDetails/types/response'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class CourseDetailsController
    implements ControllerContract<[id: string], GetCourseDetailsResponse>
{
    constructor(
        private courseRepo: CoursePostgresRepository,
        private imageRepo: ImagePostgresByCourseRepository,
        private videoRepository: VideoPostgresByCourseRepository,
        private trainerRepository: TrainerPostgresByCourseRepository,
        private categoryRepository: CategoryPostgresByCourseRepository,
    ) {}
    @Get('one/:id')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GetCourseDetailsResponse> {
        const result = await new ErrorDecorator(
            new GetCourseDetailsQuery(
                this.courseRepo,
                this.imageRepo,
                this.videoRepository,
                this.trainerRepository,
                this.categoryRepository,
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            id,
        })

        return result.unwrap()
    }
}
