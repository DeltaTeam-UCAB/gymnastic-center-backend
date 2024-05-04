import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import {
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import {
    Roles,
    RolesGuard,
} from 'src/client/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/client/infraestructure/guards/user.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { ApiHeader } from '@nestjs/swagger'
import { Image } from '../../../../image/infraestructure/models/postgres/image'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix.ts'
import { informationCourseProperty } from './api_property/information-course.property.ts'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
})
export class CourseInformationController
    implements ControllerContract<[id: string], informationCourseProperty>
{
    constructor(
        @InjectRepository(Course) private courseRepo: Repository<Course>,
        @InjectRepository(Image) private imageRepo: Repository<Image>,
    ) {}
    @Get('information/:id')
    @ApiHeader({
        name: 'auth',
    })
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<informationCourseProperty> {
        const possibleCourse = await this.courseRepo.findOneBy({ id })

        if (!possibleCourse) {
            throw new NotFoundException()
        }
        const imgSrc = await this.imageRepo.findOneBy({
            id: possibleCourse.image,
        })
        if (!imgSrc) {
            throw new NotFoundException()
        }

        return {
            title: possibleCourse.title,
            description: possibleCourse.description,
            calories: possibleCourse.calories,
            instructor: possibleCourse.instructor,
            category: possibleCourse.category,
            image: imgSrc.src,
        }
    }
}
