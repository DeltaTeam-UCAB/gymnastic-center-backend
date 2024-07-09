import { DeleteCoursesByTrainerCommand } from '../../../../../src/course/application/commands/delete-by-trainer/delete-by-trainer.course.command'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { createCourse } from './utils/course.factory'
import { TrainerID } from '../../../../../src/course/domain/value-objects/trainer.id'

export const name = 'Should delete courses by trainer'
export const body = async () => {
    const imageId = '9fd3da36-e884-4ceb-a6da-cc3e52c35a47'
    const categoryId = 'f568e490-2996-41d9-ac71-154b664866a4'
    const trainerId = '44a61cf2-e1c8-4c7e-92f6-f3120dea5167'
    const course1Id = '01fc70fa-d328-479c-a0c2-117aec3ebb2b'
    const course2Id = 'adc1d5fd-e7bd-4396-8bfb-c9274dfc477e'
    const courseRepo = new CourseRepositoryMock([
        createCourse({
            id: course1Id,
            category: { id: categoryId, name: 'category test name' },
            imageId,
            trainer: { id: trainerId, name: 'trainer test name' },
        }),
        createCourse({
            id: course2Id,
            category: { id: categoryId, name: 'category test name' },
            imageId,
            trainer: { id: trainerId, name: 'trainer test name' },
        }),
    ])
    const commandBase = new DeleteCoursesByTrainerCommand(
        courseRepo,
        eventPublisherStub,
    )
    await commandBase.execute({ id: trainerId })
    const courses = await courseRepo.countByTrainer(new TrainerID(trainerId))
    lookFor(courses).equals(0)
}
