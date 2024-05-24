import { ApplicationService } from 'src/core/application/service/application.service'
import { PaginationDtoentry } from './types/paginationDTO_entry'
import { paginationResponse } from './types/paginationDTO_response'
import { CourseRepository } from '../repositories/course.repository'
import { Result } from 'src/core/application/result-handler/result.handler'

export class PaginationCourseService
implements ApplicationService<PaginationDtoentry, paginationResponse>
{
    private readonly courseRepo: CourseRepository

    constructor(courseRepo: CourseRepository) {
        this.courseRepo = courseRepo
    }
    async execute(
        data: PaginationDtoentry,
    ): Promise<Result<paginationResponse>> {
        const pagination = await this.courseRepo.Pagination(
            data.limit,
            data.offset,
        )

        return Result.success(pagination)
    }
}
