import { Body, HttpException, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { ClientGuard } from '../../guards/client.guard'
import { Client as ClientDecorator } from '../../decorators/client.decorator'
import { UserGuard } from '../../guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Client } from 'src/client/infraestructure/models/postgres/client.entity'
import { LikeCommentDTO } from './dto/like.comment.dto'
import { Like } from '../../models/postgres/like.entity'

@Controller({
    path: 'like',
    docTitle: 'Comment',
})
export class LikeCommentController
    implements
        ControllerContract<
            [client: Client, body: LikeCommentDTO],
            {
                message: string
            }
        >
{
    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Like) private likeRepo: Repository<Like>,
    ) {}

    @Post('')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard, ClientGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @ClientDecorator() client: Client,
        @Body() body: LikeCommentDTO,
    ): Promise<{ message: string }> {
        const possibleComment = await this.commentRepo.findOneBy({
            id: body.idComment,
        })
        if (!possibleComment) throw new HttpException('Comment not found', 400)
        const possibleLike = await this.likeRepo.findOne({
            where: {
                commentId: body.idComment,
                clientId: client.id,
                like: true,
            },
        })
        if (possibleLike) throw new HttpException('Comment already liked', 400)
        const likeInfo = {
            clientId: client.id,
            commentId: possibleComment.id,
            like: true,
        }
        this.likeRepo.save(likeInfo)
        return {
            message: 'Succesful',
        }
    }
}
