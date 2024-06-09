import { Entity } from 'src/core/domain/entity/entity'
import { CourseID } from '../value-objects/course.id'
import { LessonID } from '../value-objects/lesson.id'

export class Course extends Entity<CourseID> {
    constructor(
        id: CourseID,
        private data: {
            lessons: LessonID[]
        },
    ) {
        super(id)
    }

    get lessons() {
        return this.data.lessons
    }
}
