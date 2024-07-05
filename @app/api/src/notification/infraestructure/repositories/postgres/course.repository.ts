import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { CourseRepository } from 'src/notification/application/repositories/course.repository'
import { Course } from 'src/notification/application/models/course'

export class CoursePostgresByNotificationRepository
    implements CourseRepository
{
    constructor(
        @InjectRepository(CourseORM)
        private courseProvider: Repository<CourseORM>,
    ) {}
    async getById(id: string): Promise<Optional<Course>> {
        return this.courseProvider.findOneBy({
            id,
            active: true,
        })
    }
}
