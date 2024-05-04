import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Course } from 'src/course/infraestructure/models/postgres/course.entity'
import { PaginationDto } from './dto/pagination.dto'
import { UserGuard } from '../../guards/user.guard'
import { Like } from '../../models/postgres/like.entity'
import { ClientGuard } from '../../guards/client.guard'
import { Client } from 'src/client/infraestructure/models/postgres/client.entity'
import { Client as ClientDecorator } from '../../decorators/client.decorator'

@Controller({
    path: 'find-course-comments',
    docTitle: 'Comment',
})
export class FindCourseCommentsController
    implements
        ControllerContract<
            [query: PaginationDto, param: string, client: Client],
            {
                comment: Comment
                likes: number
                dislikes: number
                userLiked: boolean
            }[]
        >
{
    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        @InjectRepository(Like) private likeRepo: Repository<Like>,
    ) {}

    @Get(':id')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard, ClientGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query() query: PaginationDto,
        @Param('id', ParseUUIDPipe) param: string,
        @ClientDecorator() client: Client,
    ): Promise<
        {
            comment: Comment
            likes: number
            dislikes: number
            userLiked: boolean
        }[]
    > {
        const possibleCourse = await this.courseRepo.findOneBy({ id: param })
        if (!possibleCourse) throw new HttpException('Course not found', 400)
        const { offset = 0, limit = 10 } = query
        const comments = await this.commentRepo.find({
            take: limit,
            skip: offset,
            where: { courseId: param },
        })
        const commentsWithLikes = comments.asyncMap(async (e) => {
            const likes = await this.likeRepo.count({
                where: {
                    commentId: e.id,
                    like: true,
                },
            })
            const dislikes = await this.likeRepo.count({
                where: {
                    commentId: e.id,
                    like: false,
                },
            })
            const userLiked = await this.likeRepo.exists({
                where: {
                    commentId: e.id,
                    clientId: client.id,
                },
            })
            return {
                comment: e,
                likes,
                dislikes,
                userLiked,
            }
        })
        return commentsWithLikes
    }
}
