import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteCourseCommentsPolicyDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { DeleteCommentsByTargetDTO } from '../../commands/delete-by-target/types/dto'
import { CourseRepository } from '../../repositories/course.repository'
import { courseNotExistError } from '../../errors/course.not.exist'

export class DeleteCourseCommentsPolicy
    implements ApplicationService<DeleteCourseCommentsPolicyDTO, void>
{
    constructor(
        private deleteService: ApplicationService<
            DeleteCommentsByTargetDTO,
            void
        >,
        private courseRepository: CourseRepository,
    ) {}
    async execute(data: DeleteCourseCommentsPolicyDTO): Promise<Result<void>> {
        const course = await this.courseRepository.getById(data.courseId)
        if (!course) return Result.error(courseNotExistError())
        const results = await course.lessons.asyncMap((e) =>
            this.deleteService.execute({
                type: 'LESSON',
                targetId: e,
            }),
        )
        const possibleError = results.find((e) => e.isError())
        if (possibleError) return possibleError.convertToOther()
        return Result.success(undefined)
    }
}
