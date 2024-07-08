import { Entity } from 'src/core/domain/entity/entity'
import { CourseID } from '../value-objects/course.id'
import { LessonID } from '../value-objects/lesson.id'
import { CourseTitle } from '../value-objects/course.title'
import { Clonable } from 'src/core/domain/clonable/clonable'

export class Course extends Entity<CourseID> implements Clonable<Course> {
    constructor(
        id: CourseID,
        private data: {
            title: CourseTitle
            lessons: LessonID[]
        },
    ) {
        super(id)
    }

    clone(): Course {
        return new Course(this.id, this.data)
    }

    get title() {
        return this.data.title
    }

    get lessons() {
        return [...this.data.lessons]
    }
}
