import { Course } from 'src/course/infraestructure/models/postgres/course.entity'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationDto } from '../dto/pagination-course.dto'
import { Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'

@Injectable()
export class CoursesSearchService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async findOne(term: string): Promise<Course | undefined> {
        let course: Course | undefined

        if (isUUID(term)) {
            course =
                (await this.courseRepository.findOne({
                    where: { id: term },
                })) ?? undefined
        }

        if (!course) {
            throw new NotFoundException(
                `Course with id or name ${term} not found`,
            )
        }

        return course
    }

    findAll(paginationDto: PaginationDto) {
        const { limit = 10, offset = 5 } = paginationDto

        const courses = this.courseRepository.find({
            take: limit,
            skip: offset,
        })

        return courses.map((course) => ({
            ...course,
        }))
    }
}
