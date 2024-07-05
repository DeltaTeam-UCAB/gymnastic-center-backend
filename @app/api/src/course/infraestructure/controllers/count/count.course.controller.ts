import { Get, HttpException, Query, UseGuards } from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CountCoursesResponse } from 'src/course/application/queries/countByTrainer/types/response'
import { CountCoursesQuery } from 'src/course/application/queries/countByTrainer/countByTrainer.course'
import { CountCoursesDTO } from './dto/dto'
import { isNotNull } from 'src/utils/null-manager/null-checker'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class CourseDetailsController
    implements
        ControllerContract<[query: CountCoursesDTO], CountCoursesResponse>
{
    constructor(private courseRepo: CoursePostgresRepository) {}
    @Get('count')
    @UseGuards(UserGuard)
    async execute(
        @Query() query: CountCoursesDTO,
    ): Promise<CountCoursesResponse> {
        if (!isNotNull(query.category) && !isNotNull(query.trainer)) {
            throw new HttpException('Category and Trainer ID are null', 400)
        }
        const nestLogger = new NestLogger('Count By Trainer Courses logger')
        const result = await new ErrorDecorator(
            new LoggerDecorator(
                new CountCoursesQuery(this.courseRepo),
                nestLogger,
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            trainer: query.trainer,
            category: query.category,
        })

        return result.unwrap()
    }
}
