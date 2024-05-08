import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Posts } from '../../models/postgres/post.entity'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { PostImages } from '../../models/postgres/post-images.entity'
import { Get, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Image } from 'src/image/infraestructure/models/postgres/image'

@Controller({
    path: 'post',
    docTitle: 'Post',
})
export class GetPostByIdController
    implements ControllerContract<[id: string], Posts & { images: Image[] }>
{
    constructor(
        @InjectRepository(Posts)
        private readonly postRepo: Repository<Posts>,

        @InjectRepository(PostImages)
        private readonly postImageRepo: Repository<PostImages>,

        @InjectRepository(Image)
        private readonly imageRepo: Repository<Image>,
    ) {}

    @Get('getById/:id')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id') id: string,
    ): Promise<Posts & { images: Image[] }> {
        const post = await this.postRepo.findOneBy({ id })

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`)
        }

        return {
            ...post,
            images: await this.postImageRepo
                .findBy({
                    postId: post.id,
                })
                .map((e) =>
                    this.imageRepo.findOneByOrFail({
                        id: e.imageId,
                    }),
                ),
        }
    }
}
