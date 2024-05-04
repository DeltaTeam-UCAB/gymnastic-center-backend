import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CreatePostDTO } from './dto/create.post.dto'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Repository } from 'typeorm'
import { Posts } from '../../models/postgres/post.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { PostImages } from '../../models/postgres/post-images.entity'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'

@Controller({
    path: 'post',
    docTitle: 'Post',
})
export class CreatePostController
implements ControllerContract<[body: CreatePostDTO], { id: string }>
{
    constructor(
        @Inject(UUID_GEN_NATIVE)
        private idGen: IDGenerator<string>,

        @InjectRepository(Posts)
        private postRepo: Repository<Posts>,

        @InjectRepository(PostImages)
        private imagePostRepo: Repository<PostImages>,
    ) {}

    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@Body() body: CreatePostDTO): Promise<{ id: string }> {
        const { images = [], ...postDetails } = body

        const existingPost = await this.postRepo.findOneBy({
            title: postDetails.title,
        })
        if (existingPost) {
            throw new HttpException(
                'A post with this title already exists',
                400,
            )
        }

        const postId = this.idGen.generate()
        this.postRepo.create(postDetails)
        await this.postRepo.save([{ id: postId, ...postDetails }])

        for (const image of images) {
            const imageId = this.idGen.generate()
            const imageEntity = this.imagePostRepo.create({
                id: imageId,
                url: image,
                postId,
            })
            await this.imagePostRepo.save(imageEntity)
        }

        return { id: postId }
    }
}
