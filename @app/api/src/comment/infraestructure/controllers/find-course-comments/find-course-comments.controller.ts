import { Body, Get, HttpException, Param, ParseUUIDPipe, Query, UseGuards} from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { Course } from 'src/course/infraestructure/models/postgres/course.entity'
import { PaginationDto } from './dto/pagination.dto'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: 'find-course-comments',
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
        @InjectRepository(Course) private courseRepo: Repository<Course>,
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
        const possibleCourse = await this.courseRepo.findOneBy({id:param})
        if(!possibleCourse) throw new HttpException('Course not found',400)
        const {offset = 0, limit = 10} = query
        const comments = this.commentRepo.find({
            take: limit,
            skip: offset,
            where: {courseId: param}
        })
        return comments
    }
}
