import { Entity } from 'src/core/domain/entity/entity'
import { CourseID } from '../value-objects/course.id'
import { LessonID } from '../value-objects/lesson.id'
import { CourseTitle } from '../value-objects/course.title'

export class Course extends Entity<CourseID> {
    constructor(
        id: CourseID,
        private data: {
            title: CourseTitle
            lessons: LessonID[]
        },
    ) {
        super(id)
    }

    get title() {
        return this.data.title
    }

    get lessons() {
        return this.data.lessons
    }
}
