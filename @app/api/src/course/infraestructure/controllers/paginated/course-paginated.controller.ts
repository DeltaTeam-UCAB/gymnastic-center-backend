import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_ROUTE_PREFIX, COURSE_DOC_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { PaginationDtoentry } from 'src/course/application/query/types/paginationDTO_entry'
import { paginationResponse } from 'src/course/application/query/types/paginationDTO_response'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'
import { PaginationCourseService } from 'src/course/application/query/pagination.course.query'
@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class PaginationController
implements
        ControllerContract<[data: PaginationDtoentry], paginationResponse>
{
    constructor(private courseRepository: CoursePostgresRepository) {}

    @Get('pagination')
    @Roles('ADMIN')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Query() param: PaginationDtoentry,
    ): Promise<paginationResponse> {
        const result = await new PaginationCourseService(
            this.courseRepository,
        ).execute(param)

        return result.unwrap()
    }
}
