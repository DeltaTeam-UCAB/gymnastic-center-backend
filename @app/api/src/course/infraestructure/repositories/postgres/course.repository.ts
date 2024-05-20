import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from 'src/course/application/models/course'
import { CourseRepository } from 'src/course/application/repositories/course.repository'
import { Course as UserORM } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CoursePostgresRepository implements CourseRepository {
    constructor(
        @InjectRepository(UserORM) private courseProvider: Repository<UserORM>,
    ) {}

    async save(course: Course): Promise<Result<Course>> {
        await this.courseProvider.upsert(this.courseProvider.create(course), ['id'])
        return Result.success(course)
    }

    async getById(id: string): Promise<Optional<Course>> {
        const course = await this.courseProvider.findOneBy({
            id,
        })
        return course
    }

    existByTitle(title: string): Promise<boolean> {
        return this.courseProvider.existsBy({
            title,
        })
    }
}
