import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { GetSubscriptionTrendingQuery } from 'src/subscription/application/queries/trending/subscription.trending.query'
import { GetSubscriptionTrendingResponse } from 'src/subscription/application/queries/trending/types/response'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { SubscriptionPostgresRepository } from '../../repositories/postgres/subscription.repository'
import { CoursePostgresBySubscriptionRepository } from '../../repositories/postgres/course.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { Get, HttpException, UseGuards } from '@nestjs/common'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { User } from 'src/user/infraestructure/decorators/user.decorator'

@Controller({
    path: 'progress',
    docTitle: 'Subscription',
})
export class GetSubscriptionTrending
    implements
        ControllerContract<
            [user: CurrentUserResponse],
            GetSubscriptionTrendingResponse
        >
{
    constructor(
        private subscriptionRepository: SubscriptionPostgresRepository,
        private courseRepository: CoursePostgresBySubscriptionRepository,
    ) {}

    @Get('trending')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
    ): Promise<GetSubscriptionTrendingResponse> {
        const resp = await new ErrorDecorator(
            new LoggerDecorator(
                new GetSubscriptionTrendingQuery(
                    this.subscriptionRepository,
                    this.courseRepository,
                ),
                new NestLogger('Subscription trending'),
            ),
            (e) => new HttpException(e.message, 404),
        ).execute({
            client: user.id,
        })
        return resp.unwrap()
    }
}
