import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_ROUTE_PREFIX, COURSE_DOC_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { GetCoursesManyQuery } from 'src/course/application/queries/many/course.many.query'
import { ImagePostgresByCourseRepository } from '../../repositories/postgres/image.repository'
import { GetCoursesManyResponse } from 'src/course/application/queries/many/types/response'
import { GetAllCoursesDTO } from './dto/getAll.blogs.dto'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'
@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class CoursesManyController
    implements
        ControllerContract<[data: GetAllCoursesDTO], GetCoursesManyResponse>
{
    constructor(
        private courseRepository: CoursePostgresRepository,
        private imageRepository: ImagePostgresByCourseRepository,
    ) {}

    @Get('many')
    @UseGuards(UserGuard)
    async execute(
        @Query() data: GetAllCoursesDTO,
    ): Promise<GetCoursesManyResponse> {
        const result = await new GetCoursesManyQuery(
            this.courseRepository,
            new ImageRedisRepositoryProxy(this.imageRepository),
        ).execute(data)

        return result.unwrap()
    }
}
