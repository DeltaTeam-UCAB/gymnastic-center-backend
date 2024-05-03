import { Get, HttpException, Param, ParseUUIDPipe, Query, UseGuards} from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { PaginationDto } from './dto/pagination.dto'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: 'find-post-comments',
    docTitle: 'Comment',
})
export class CommentPostController
    implements
        ControllerContract<
            [query:PaginationDto,param: string,],
            Comment[]
        >
{
    constructor(
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        //@InjectRepository(Post) private courseRepo: Repository<Post>,
    ) {}

    @Get(':id')
    @Roles('CLIENT','ADMIN')
    @UseGuards(UserGuard,RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query() query: PaginationDto,
        @Param('id',ParseUUIDPipe) param: string,
    ): Promise<Comment[]> {
        // const possibleCourse = await this.postRepo.findOneBy({id:param})
        // if(!possibleCourse) throw new HttpException('Course not found',400)
        // const {offset = 0, limit = 10} = query
        // const comments = this.commentRepo.find({
        //     take: limit,
        //     skip: offset,
        //     where: {postId: param}
        // })
        // return comments
        throw new HttpException('Not implemented yet',501)
    }
}
