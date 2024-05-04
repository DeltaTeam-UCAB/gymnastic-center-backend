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
    path: 'like',
    docTitle: 'Comment',
})
export class CountCommentLikesController
    implements
        ControllerContract<
            [param: string],
            {
                likes: number
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
    ): Promise<{ likes: number }> {
        const possibleComment = await this.commentRepo.findOne({
            where: {
                id: param,
            },
        })
        if (!possibleComment) throw new HttpException('Comment not found', 400)
        const likes = await this.likeRepo.count({
            where: {
                commentId: param,
                like: true,
            },
        })
        return {
            likes,
        }
    }
}
