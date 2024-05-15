import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import {
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { UserGuard } from 'src/client/infraestructure/guards/user.guard'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { ApiHeader } from '@nestjs/swagger'
import { Image } from '../../../../image/infraestructure/models/postgres/image.entity'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { informationCourseProperty } from './api_property/information-course.property'
import { Lesson } from '../../models/postgres/lesson.entity'

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
        @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    ) {}
    @Get('information/:id')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<informationCourseProperty> {
        const possibleCourse = await this.courseRepo.findOneBy({ id })

        if (!possibleCourse) {
            throw new NotFoundException()
        }

        const imgSrc = await this.imageRepo.findOneBy({
            id: possibleCourse.imageId,
        })

        if (!imgSrc) {
            throw new NotFoundException()
        }

        const possibleLessons = await this.lessonRepo.findBy({
            course: possibleCourse,
        })

        return {
            title: possibleCourse.title,
            description: possibleCourse.description,
            calories: possibleCourse.calories,
            instructor: possibleCourse.instructor,
            category: possibleCourse.category,
            image: imgSrc.src,
            lessons: possibleLessons,
        }
    }
}
