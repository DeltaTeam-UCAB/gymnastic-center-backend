import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { LessonRepository } from '../repositories/lesson.repository'
import { BlogRepository } from '../repositories/blog.repository'
import { postNotFoundError } from '../errors/post.not.found'
import { lessonNotFoundError } from '../errors/lesson.not.found'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'
import { TargetType } from '../types/target-type'

export interface TargetInfo {
    targetId: string
    targetType: TargetType
}

export class CheckTargetExistence<T extends TargetInfo, R>
    implements ApplicationService<T, R>
{
    constructor(
        private decoratee: ApplicationService<T, R>,
        private lessonRepository: LessonRepository,
        private blogRepository: BlogRepository,
    ) {}

    async execute(data: T): Promise<Result<R>> {
        let targetFound
        if (data.targetType === 'BLOG') {
            targetFound = await this.blogRepository.existsById(
                new BlogID(data.targetId),
            )
            if (!targetFound) return Result.error(postNotFoundError())
        } else if (data.targetType === 'LESSON') {
            targetFound = await this.lessonRepository.existsById(
                new LessonID(data.targetId),
            )
            if (!targetFound) return Result.error(lessonNotFoundError())
        }
        return this.decoratee.execute(data)
    }
}
