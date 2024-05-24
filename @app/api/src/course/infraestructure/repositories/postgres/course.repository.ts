import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from 'src/course/application/models/course'
import { CourseRepository } from 'src/course/application/repositories/course.repository'
import { Course as UserORM } from '../../models/postgres/course.entity'
import { Image as ImageORM } from 'src/image/infraestructure/models/postgres/image.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CoursePostgresRepository implements CourseRepository {
    constructor(
        @InjectRepository(UserORM) private courseProvider: Repository<UserORM>,
        @InjectRepository(ImageORM)
        private ImageRepository: Repository<ImageORM>,
    ) {}

    async save(course: Course): Promise<Result<Course>> {
        await this.courseProvider.upsert(this.courseProvider.create(course), [
            'id',
        ])
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

    async Pagination(limit?: number, offset?: number): Promise<Course[]> {

        return this.courseProvider
            .find({
                take: limit,
                skip: offset,
            })
            .map(async (course) => ({
                ...course,
                image: await this.ImageRepository.findOneByOrFail({
                    id: course.imageId,
                }),
            }))
    }
}
