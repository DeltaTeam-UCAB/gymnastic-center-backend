import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_ROUTE_PREFIX, COURSE_DOC_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { GetCoursesManyQuery } from 'src/course/application/queries/many/course.many.query'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { GetCoursesManyResponse } from 'src/course/application/queries/many/types/response'
import { TrainerPostgresByCourseRepository } from '../../repositories/postgres/trainer.repository'
import { CategoryPostgresByCourseRepository } from '../../repositories/postgres/category.repository'
import { GetAllCoursesDTO } from './dto/getAll.blogs.dto'
@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class CoursesManyController
implements
        ControllerContract<[data: GetAllCoursesDTO], GetCoursesManyResponse>
{
    constructor(
        private courseRepository: CoursePostgresRepository,
        private imageRepository: ImagePostgresByCourseRepository,
        private trainerRepository: TrainerPostgresByCourseRepository,
        private categoryRepository: CategoryPostgresByCourseRepository,
    ) {}

    @Get('many')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(
        @Query() data: GetAllCoursesDTO,
    ): Promise<GetCoursesManyResponse> {
        const result = await new GetCoursesManyQuery(
            this.courseRepository,
            this.categoryRepository,
            this.trainerRepository,
            this.imageRepository,
        ).execute(data)

        return result.unwrap()
    }
}
