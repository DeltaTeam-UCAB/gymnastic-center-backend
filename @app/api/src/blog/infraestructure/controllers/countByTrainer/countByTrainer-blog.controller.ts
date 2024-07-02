import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CountByTrainerBlogQuery } from 'src/blog/application/queries/countByTrainer/countByTrainer.query.blog'
import { CountByTrainerBlogResponse } from 'src/blog/application/queries/countByTrainer/types/response'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
    bearerAuth: true,
})
export class GetAllBlogController
    implements ControllerContract<[param: string], CountByTrainerBlogResponse>
{
    constructor(private blogRepository: BlogPostgresRepository) {}

    @Get('count/trainer/:id')
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
    ): Promise<CountByTrainerBlogResponse> {
        console.log(param)
        const nestLogger = new NestLogger('Count Blogs By Trainer logger')
        const result = await new LoggerDecorator(
            new CountByTrainerBlogQuery(this.blogRepository),
            nestLogger,
        ).execute({
            trainer: param,
        })
        return result.unwrap()
    }
}
