import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CommentCourseDTO } from './dto/comment.course.dto'
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
import { Course } from 'src/course/infraestructure/models/postgres/course.entity'

@Controller({
    path: 'comment-course',
    docTitle: 'Comment',
})
export class CommentCourseController
    implements
        ControllerContract<
            [client: Client, body: CommentCourseDTO],
            {
                message: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Course) private courseRepo: Repository<Course>,
    ) {}

    @Post('create')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard, ClientGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @ClientDecorator() client: Client,
        @Body() body: CommentCourseDTO,
    ): Promise<{ message: string }> {
        const possibleCourse = await this.courseRepo.findOneBy({
            id: body.idCourse,
        })
        if (!possibleCourse) throw new HttpException('Course not found', 400)
        const commentInfo = {
            id: this.idGen.generate(),
            clientId: client.id,
            courseId: possibleCourse.id,
            description: body.description,
        }
        this.commentRepo.save(commentInfo)
        return {
            message: 'Succesful',
        }
    }
}
