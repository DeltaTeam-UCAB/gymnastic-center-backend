import { Body, Delete, HttpException, UseGuards } from '@nestjs/common'
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
import { DeleteLikeDTO } from './dto/delete.like.dto'
import { Like } from '../../models/postgres/like.entity'

@Controller({
    path: 'like',
    docTitle: 'Comment',
})
export class DeleteLikeController
    implements
        ControllerContract<
            [client: Client, body: DeleteLikeDTO],
            {
                message: string
            }
        >
{
    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Like) private likeRepo: Repository<Like>,
    ) {}

    @Delete('delete')
    @Roles('CLIENT')
    @UseGuards(ClientGuard, UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @ClientDecorator() client: Client,
        @Body() body: DeleteLikeDTO,
    ): Promise<{ message: string }> {
        const possibleLike = await this.likeRepo.findOne({
            where:{
                commentId: body.idComment,
                clientId: client.id,
            }
        })
        if(!possibleLike) throw new HttpException('Like not found',400)
        this.likeRepo.delete({
            commentId: body.idComment,
            clientId: client.id,
        })
        return {
            message: 'Succesful',
        }
    }
}
