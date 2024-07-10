import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, HttpException, Query, UseGuards } from '@nestjs/common'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CountBlogsQuery } from 'src/blog/application/queries/count/count.query.blog'
import { CountBlogsResponse } from 'src/blog/application/queries/count/types/response'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { CountBlogsDTO } from './dto/dto'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
    bearerAuth: true,
})
export class GetAllBlogController
implements ControllerContract<[query: CountBlogsDTO], CountBlogsResponse>
{
    constructor(private blogRepository: BlogPostgresRepository) {}

    @Get('count')
    @UseGuards(UserGuard)
    async execute(@Query() query: CountBlogsDTO): Promise<CountBlogsResponse> {
        if (!isNotNull(query.category) && !isNotNull(query.trainer)) {
            throw new HttpException('Category and Trainer ID are null', 400)
        }
        const nestLogger = new NestLogger('Count Blogs By Trainer logger')
        const result = await new LoggerDecorator(
            new CountBlogsQuery(this.blogRepository),
            nestLogger,
        ).execute({
            trainer: query.trainer,
            category: query.category,
        })
        return result.unwrap()
    }
}
