import { Body, HttpException, Inject, Post, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { COURSE_ROUTE_PREFIX } from '../prefix'
import { COURSE_DOC_PREFIX } from '../prefix'
import { CreateCourseDTO } from './dto/create-course.dto'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { CreateCourseResponse } from 'src/course/application/commands/createCourse/types/response'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateCourseCommand } from 'src/course/application/commands/createCourse/create.course.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { CourseTitleNotExistDecorator } from 'src/course/application/commands/createCourse/decorators/title.exist.decorator'
import { CategoryPostgresByCourseRepository } from '../../repositories/postgres/category.repository'
import { TrainerPostgresByCourseRepository } from '../../repositories/postgres/trainer.repository'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { VideoPostgresByCourseRepository } from '../../repositories/postgres/video.repository'
import { CategoryExistDecorator } from 'src/course/application/commands/createCourse/decorators/category.exist.decorator'
import { TrainerExistDecorator } from 'src/course/application/commands/createCourse/decorators/trainer.exist.decorator'
import { ImagesExistDecorator } from 'src/course/application/commands/createCourse/decorators/images.exist.decorator'
import { VideosExistDecorator } from 'src/course/application/commands/createCourse/decorators/videos.exist.decorator'
import { COURSE_TITLE_EXIST } from 'src/course/application/errors/course.title.exist'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class CreateCourseController
    implements
        ControllerContract<
            [body: CreateCourseDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private courseRepo: CoursePostgresRepository,
        private categoryRepository: CategoryPostgresByCourseRepository,
        private trainerRepository: TrainerPostgresByCourseRepository,
        private imageRepository: ImagePostgresByCourseRepository,
        private videoRepository: VideoPostgresByCourseRepository,
    ) {}

    @Post('create')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateCourseDTO,
    ): Promise<CreateCourseResponse> {
        const commandBase = new CreateCourseCommand(
            this.idGen,
            this.courseRepo,
            new ConcreteDateProvider(),
        )
        const commandTitleValidation = new CourseTitleNotExistDecorator(
            commandBase,
            this.courseRepo,
        )
        const commandWithCategoryValidator = new CategoryExistDecorator(
            commandTitleValidation,
            this.categoryRepository,
        )
        const commandWithTrainerValidation = new TrainerExistDecorator(
            commandWithCategoryValidator,
            this.trainerRepository,
        )
        const commandWithImageValidator = new ImagesExistDecorator(
            commandWithTrainerValidation,
            this.imageRepository,
        )
        const commandWithVideoValidator = new VideosExistDecorator(
            commandWithImageValidator,
            this.videoRepository,
        )
        const result = await new ErrorDecorator(
            commandWithVideoValidator,
            (e) => {
                if (e.name === COURSE_TITLE_EXIST)
                    return new HttpException(e.message, 400)
                return new HttpException(e.message, 404)
            },
        ).execute(body)
        return result.unwrap()
    }
}
