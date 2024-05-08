import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CommentPostDTO } from './dto/comment.post.dto'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { ClientGuard } from '../../guards/client.guard'
import { Client as ClientDecorator } from '../../decorators/client.decorator'
import { UserGuard } from '../../guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Client } from 'src/client/infraestructure/models/postgres/client.entity'
import { Posts } from 'src/post/infraestructure/models/postgres/post.entity'

@Controller({
    path: 'comment-post',
    docTitle: 'Comment',
})
export class CommentPostController
    implements
        ControllerContract<
            [client: Client, body: CommentPostDTO],
            {
                message: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Posts) private postRepo: Repository<Posts>,
    ) {}

    @Post('create')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard, ClientGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @ClientDecorator() client: Client,
        @Body() body: CommentPostDTO,
    ): Promise<{ message: string }> {
        const possiblePost = await this.postRepo.findOneBy({ id: body.idPost })
        if (!possiblePost) throw new HttpException('Post not found', 400)
        const commentInfo = {
            id: this.idGen.generate(),
            clientId: client.id,
            postId: possiblePost.id,
            description: body.description,
        }
        this.commentRepo.save(commentInfo)
        return {
            message: 'Successful',
        }
    }
}
