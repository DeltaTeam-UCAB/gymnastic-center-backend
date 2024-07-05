import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from 'src/comment/application/models/course'
import { CourseRepository } from 'src/comment/application/repositories/course.repository'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { Lesson as LessonORM } from '../../models/postgres/lesson.entity'

export class CoursePostgreByCommentRepositry implements CourseRepository {
    constructor(
        @InjectRepository(LessonORM)
        private lessonProvider: Repository<LessonORM>,
        @InjectRepository(CourseORM)
        private courseProvider: Repository<CourseORM>,
    ) {}
    async getById(id: string): Promise<Optional<Course>> {
        const course = await this.courseProvider.findOneBy({
            id,
        })
        if (!course) return null
        return {
            id: course.id,
            lessons: await this.lessonProvider
                .findBy({
                    courseId: course.id,
                })
                .map((e) => e.id),
        }
    }
}
