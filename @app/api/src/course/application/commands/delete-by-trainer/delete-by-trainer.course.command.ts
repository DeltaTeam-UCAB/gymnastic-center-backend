import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteCoursesByTrainerDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'

export class DeleteCoursesByTrainerCommand
    implements ApplicationService<DeleteCoursesByTrainerDTO, void>
{
    constructor(
        private courseRepository: CourseRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(data: DeleteCoursesByTrainerDTO): Promise<Result<void>> {
        const courses = await this.courseRepository.getAllByTrainer(
            new TrainerID(data.id),
        )
        await courses.asyncForEach(async (c) => {
            c.delete()
            await this.courseRepository.delete(c)
            this.eventPublisher.publish(c.pullEvents())
        })
        return Result.success(undefined)
    }
}
