import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Like } from '../../models/postgres/like.entity'

@Controller({
    path: 'dislike',
    docTitle: 'Comment',
})
export class CountCommentDislikesController
    implements
        ControllerContract<
            [param: string],
            {
                dislikes: number
            }
        >
{
    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Like) private likeRepo: Repository<Like>,
    ) {}

    @Get(':id')
    @Roles('CLIENT', 'ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) param: string,
    ): Promise<{ dislikes: number }> {
        const possibleComment = await this.commentRepo.findOne({
            where: {
                id: param,
            },
        })
        if (!possibleComment) throw new HttpException('Comment not found', 400)
        const dislikes = await this.likeRepo.count({
            where: {
                commentId: param,
                like: false,
            },
        })
        return {
            dislikes,
        }
    }
}
