import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { BLOG_ROUTE_PREFIX, BLOG_DOC_PREFIX } from '../prefix'
import { CreateBlogDTO } from './dto/create.blog.dto'
import { CreateBlogResponse } from '../../../../../src/blog/application/commands/create/types/response'
import { CreateBlogCommand } from 'src/blog/application/commands/create/create.blog.command'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
})
export class CreateBlogController
implements ControllerContract<[body: CreateBlogDTO], { id: string }>
{
    constructor(
        @Inject(UUID_GEN_NATIVE)
        private idGen: IDGenerator<string>,

        private blogRepository: BlogPostgresRepository,
    ) {}

    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@Body() body: CreateBlogDTO): Promise<CreateBlogResponse> {
        const result = await new ErrorDecorator(
            new CreateBlogCommand(this.idGen, this.blogRepository),
            (e) => new HttpException(e.message, 400),
        ).execute(body)
        return result.unwrap()
    }
}
