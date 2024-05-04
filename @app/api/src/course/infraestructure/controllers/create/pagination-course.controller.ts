import { Body } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Course } from '../../models/postgres/course.entity'
import { PaginationDto } from './dto/pagination-course.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Controller()
export class PaginationCourseController
    implements ControllerContract<PaginationDto, Course[]>
{
    constructor(
        @InjectRepository(Course)
        private readonly courseRepo: Repository<Course>,
    ) {}

    async execute(@Body() paginationDto: PaginationDto): Promise<Course[]> {
        const { limit = 10, offset = 0 } = paginationDto
        return this.courseRepo.find({
            take: limit,
            skip: offset,
        })
    }
}
