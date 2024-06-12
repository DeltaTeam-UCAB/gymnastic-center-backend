import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_ROUTE_PREFIX, COURSE_DOC_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { TrainerPostgresByCourseRepository } from '../../repositories/postgres/trainer.repository'
import { CategoryPostgresByCourseRepository } from '../../repositories/postgres/category.repository'
import { GetSubscribedCoursesPaginatedQuery } from 'src/course/application/queries/paginatedSubscribedCourses/subscribedCourses.paginated.query'
import { GetSubscribedCoursesDTO } from './dto/getSubscribedCourses.dto'
import { GetSubscribedCoursesResponse } from 'src/course/application/queries/paginatedSubscribedCourses/types/response'
import { SuscriptionPostgresByCourseRepository } from '../../repositories/postgres/suscription.repository'
@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class subscribedCoursesController
    implements
        ControllerContract<
            [data: GetSubscribedCoursesDTO],
            GetSubscribedCoursesResponse
        >
{
    constructor(
        private courseRepository: CoursePostgresRepository,
        private imageRepository: ImagePostgresByCourseRepository,
        private trainerRepository: TrainerPostgresByCourseRepository,
        private categoryRepository: CategoryPostgresByCourseRepository,
        private subscriptionRepository: SuscriptionPostgresByCourseRepository,
    ) {}

    @Get('subscribedCourses')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(
        @Query() data: GetSubscribedCoursesDTO,
    ): Promise<GetSubscribedCoursesResponse> {
        const result = await new GetSubscribedCoursesPaginatedQuery(
            this.courseRepository,
            this.categoryRepository,
            this.trainerRepository,
            this.imageRepository,
            this.subscriptionRepository,
        ).execute(data)

        return result.unwrap()
    }
}
