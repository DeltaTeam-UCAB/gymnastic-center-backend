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
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CountByTrainerCourseResponse } from 'src/course/application/queries/countByTrainer/types/response'
import { CountByTrainerCourseQuery } from 'src/course/application/queries/countByTrainer/countByTrainer.course'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class CourseDetailsController
    implements ControllerContract<[id: string], CountByTrainerCourseResponse>
{
    constructor(private courseRepo: CoursePostgresRepository) {}
    @Get('count/trainer/:id')
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<CountByTrainerCourseResponse> {
        const nestLogger = new NestLogger('Count By Trainer Courses logger')
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new CountByTrainerCourseQuery(this.courseRepo),
                nestLogger,
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            trainer: id,
        })

        return result.unwrap()
    }
}
