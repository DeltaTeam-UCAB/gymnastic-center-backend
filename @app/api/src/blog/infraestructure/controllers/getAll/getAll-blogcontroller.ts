import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Posts } from '../../models/postgres/post.entity'
import { Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostImages } from '../../models/postgres/post-images.entity'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Image } from 'src/image/infraestructure/models/postgres/image.entity'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
})
export class GetAllBlogController
implements
        ControllerContract<
            [limit: number, offset: number],
            (Posts & { images: Image[] })[]
        >
{
    constructor(
        @InjectRepository(Posts)
        private readonly blogRepository: Repository<Posts>,

        @InjectRepository(PostImages)
        private readonly blogImageRepository: Repository<PostImages>,

        @InjectRepository(Image)
        private readonly imageRepository: Repository<Image>,
    ) {}

    @Get('getAll')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query('limit', ParseIntPipe) limit: number,
        @Query('offset', ParseIntPipe) offset: number,
    ): Promise<
        (Posts & {
            images: Image[]
        })[]
    > {
        const blogs = await this.blogRepository.find({
            take: limit,
            skip: offset,
        })

        return blogs.asyncMap(async (blog) => ({
            ...blog,
            body: '',
            tags: [''],
            images: await this.blogImageRepository
                .findBy({
                    postId: blog.id,
                })
                .map((e) =>
                    this.imageRepository.findOneByOrFail({
                        id: e.imageId,
                    }),
                ),
        }))
    }
}
