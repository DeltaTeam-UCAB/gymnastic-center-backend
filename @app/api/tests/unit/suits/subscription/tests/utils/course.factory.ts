import { Course } from '../../../../../../src/subscription/domain/entities/course'
import { CourseID } from '../../../../../../src/subscription/domain/value-objects/course.id'
import { CourseTitle } from '../../../../../../src/subscription/domain/value-objects/course.title'
import { LessonID } from '../../../../../../src/subscription/domain/value-objects/lesson.id'

export const createCourse = (data: {
    id?: string
    title?: string
    lessons: string[]
}) =>
    new Course(
        new CourseID(data.id || '84821c3f-0e66-4bf4-a3a8-520e42e50752'),
        {
            title: new CourseTitle(data.title || 'test course'),
            lessons: data.lessons.map((e) => new LessonID(e)),
        },
    )
