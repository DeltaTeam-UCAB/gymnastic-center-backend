import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { SubscriptionPostgresRepository } from '../../repositories/postgres/subscription.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'
import { User } from '../../decorators/user.decorator'
import { GetCourseProgressQuery } from 'src/subscription/application/queries/course-progress/course.progress.query'
import { GetCourseProgressResponse } from 'src/subscription/application/queries/course-progress/types/response'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
    bearerAuth: true,
})
export class GetSubscriptionByCourse
implements
        ControllerContract<
            [user: CurrentUserResponse, course: string],
            GetCourseProgressResponse
        >
{
    constructor(
        private subscriptionRepository: SubscriptionPostgresRepository,
    ) {}
    @Get('one/:courseId')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Param('courseId', ParseUUIDPipe) course: string,
    ): Promise<GetCourseProgressResponse> {
        const resp = await new ErrorDecorator(
            new LoggerDecorator(
                new GetCourseProgressQuery(this.subscriptionRepository),
                new NestLogger('Subscription trending'),
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            client: user.id,
            course,
        })
        return resp.unwrap()
    }
}
