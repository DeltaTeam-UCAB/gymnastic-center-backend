import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { GetCourseDetailsQuery } from 'src/course/application/queries/courseDetails/get.courseDetails.query'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { VideoPostgresByCourseRepository } from '../../repositories/postgres/video.repository'
import { GetCourseDetailsResponse } from 'src/course/application/queries/courseDetails/types/response'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'
import { VideoRedisRepositoryProxy } from '../../repositories/redis/video.repository.proxy'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class CourseDetailsController
    implements ControllerContract<[id: string], GetCourseDetailsResponse>
{
    constructor(
        private courseRepo: CoursePostgresRepository,
        private imageRepo: ImagePostgresByCourseRepository,
        private videoRepository: VideoPostgresByCourseRepository,
    ) {}
    @Get('one/:id')
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GetCourseDetailsResponse> {
        const nestLogger = new NestLogger('Get course details logger')
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new GetCourseDetailsQuery(
                    this.courseRepo,
                    new ImageRedisRepositoryProxy(this.imageRepo),
                    new VideoRedisRepositoryProxy(this.videoRepository),
                ),
                nestLogger,
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            id,
        })

        return result.unwrap()
    }
}
