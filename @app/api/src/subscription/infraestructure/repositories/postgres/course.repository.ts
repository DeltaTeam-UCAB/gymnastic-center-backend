import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { CourseRepository } from 'src/subscription/application/repositories/course.repository'
import { Course } from 'src/subscription/domain/entities/course'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { Lesson } from '../../models/postgres/lesson.entity'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { CourseTitle } from 'src/subscription/domain/value-objects/course.title'

export class CoursePostgresBySubscriptionRepository
    implements CourseRepository
{
    constructor(
        @InjectRepository(CourseORM)
        private courseProvider: Repository<CourseORM>,
        @InjectRepository(Lesson) private lessonProvider: Repository<Lesson>,
    ) {}
    async getById(id: CourseID): Promise<Optional<Course>> {
        const course = await this.courseProvider.findOneBy({
            id: id.id,
        })
        if (!course) return null
        return new Course(id, {
            title: new CourseTitle(course.title),
            lessons: await this.lessonProvider
                .findBy({
                    courseId: id.id,
                })
                .map((e) => new LessonID(e.id)),
        })
    }
}
