import { Get, Query } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Course } from '../../../models/postgres/course.entity'
import { PaginationDto } from '../dto/pagination-course.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
@Controller({
    path: 'course',
    docTitle: 'Course',
})
export class PaginationCourseController
    implements ControllerContract<PaginationDto, Course[]>
{
    constructor(
        @InjectRepository(Course)
        private readonly courseRepo: Repository<Course>,
    ) {}

    @Get('coursepage')
    async execute(@Query() paginationDto: PaginationDto): Promise<Course[]> {
        const { limit = 2, offset = 0 } = paginationDto
        console.log(paginationDto)
        return this.courseRepo.find({
            take: limit,
            skip: offset,
        })
    }
}
