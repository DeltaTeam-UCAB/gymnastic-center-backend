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
import { DislikeCommentDTO } from './dto/dislike.comment.dto'
import { Like } from '../../models/postgres/like.entity'

@Controller({
    path: 'dislike',
    docTitle: 'Comment',
})
export class CommentCourseController
    implements
        ControllerContract<
            [client: Client, body: DislikeCommentDTO],
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
    @UseGuards(ClientGuard, UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @ClientDecorator() client: Client,
        @Body() body: DislikeCommentDTO,
    ): Promise<{ message: string }> {
        const possibleComment = await this.commentRepo.findOneBy({
            id: body.idComment,
        })
        if (!possibleComment) throw new HttpException('Comment not found', 400)
        const possibleDislike = await this.likeRepo.findOne({
            where: {
                commentId: body.idComment,
                clientId: client.id,
                like: false,
            },
        })
        if (possibleDislike)
            throw new HttpException('Comment already disliked', 400)
        const likeInfo = {
            clientId: client.id,
            commentId: possibleComment.id,
            like: false,
        }
        this.likeRepo.save(likeInfo)
        return {
            message: 'Succesful',
        }
    }
}
