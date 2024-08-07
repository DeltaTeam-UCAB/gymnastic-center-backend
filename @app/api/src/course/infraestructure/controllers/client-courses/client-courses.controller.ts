import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_DOC_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { GetClientCoursesDTO } from './dto/dto'
import { GetSubscribedCoursesResponse } from 'src/course/application/queries/paginatedSubscribedCourses/types/response'
import { GetSubscribedCoursesPaginatedQuery } from 'src/course/application/queries/paginatedSubscribedCourses/GetSubscribedCoursesPaginatedQuery'
import { SubscriptionPostgresByCourseRepository } from '../../repositories/postgres/subscription.repository'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { User } from '../../decorators/user.decorator'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'

@Controller({
    path: 'progress',
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class ClientCoursesController
    implements
        ControllerContract<
            [data: GetClientCoursesDTO, user: CurrentUserResponse],
            GetSubscribedCoursesResponse
        >
{
    constructor(
        private courseRepository: CoursePostgresRepository,
        private imageRepository: ImagePostgresByCourseRepository,
        private subscriptionRepository: SubscriptionPostgresByCourseRepository,
    ) {}

    @Get('courses')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Query() data: GetClientCoursesDTO,
        @User() user: CurrentUserResponse,
    ): Promise<GetSubscribedCoursesResponse> {
        const result = await new GetSubscribedCoursesPaginatedQuery(
            this.courseRepository,
            new ImageRedisRepositoryProxy(this.imageRepository),
            this.subscriptionRepository,
        ).execute({
            client: user.id,
            ...data,
        })

        return result.unwrap()
    }
}
