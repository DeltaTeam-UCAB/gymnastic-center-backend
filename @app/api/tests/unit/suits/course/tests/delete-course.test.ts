import { DeleteCourseCommand } from '../../../../../src/course/application/commands/delete/delete.command'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { CourseID } from '../../../../../src/course/domain/value-objects/course.id'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { createCourse } from './utils/course.factory'

export const name = 'Should delete course'
export const body = async () => {
    const imageId = '9fd3da36-e884-4ceb-a6da-cc3e52c35a47'
    const categoryId = 'f568e490-2996-41d9-ac71-154b664866a4'
    const trainerId = '44a61cf2-e1c8-4c7e-92f6-f3120dea5167'
    const courseId = '01fc70fa-d328-479c-a0c2-117aec3ebb2b'
    const courseRepo = new CourseRepositoryMock([
        createCourse({
            category: { id: categoryId, name: 'category test name' },
            imageId,
            trainer: { id: trainerId, name: 'trainer test name' },
        }),
    ])
    const commandBase = new DeleteCourseCommand(courseRepo, eventPublisherStub)
    await commandBase.execute({ id: courseId })
    const courseFromRepo = await courseRepo.getById(new CourseID(courseId))
    lookFor(courseFromRepo).toBeUndefined()
}
