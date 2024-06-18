import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
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
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { GetCourseProgressQuery } from 'src/subscription/application/queries/course-progress/course.progress.query'
import { GetCourseProgressResponse } from 'src/subscription/application/queries/course-progress/types/response'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
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
    @ApiHeader({
        name: 'auth',
    })
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
