import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Posts } from '../../models/postgres/post.entity'
import { Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PostImages } from '../../models/postgres/post-images.entity'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Image } from 'src/image/infraestructure/models/postgres/image'

@Controller({
    path: 'post',
    docTitle: 'Post',
})
export class GetAllPostController
implements
        ControllerContract<
            [limit: number, offset: number],
            (Posts & { images: Image[] })[]
        >
{
    constructor(
        @InjectRepository(Posts)
        private readonly postRepo: Repository<Posts>,

        @InjectRepository(PostImages)
        private readonly postImageRepo: Repository<PostImages>,

        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>,
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
        const posts = await this.postRepo.find({
            take: limit,
            skip: offset,
        })

        return posts.asyncMap(async (post) => ({
            ...post,
            body: '',
            tags: [''],
            images: await this.postImageRepo
                .findBy({
                    postId: post.id,
                })
                .map((e) =>
                    this.imageRepo.findOneByOrFail({
                        id: e.imageId,
                    }),
                ),
        }))
    }
}
