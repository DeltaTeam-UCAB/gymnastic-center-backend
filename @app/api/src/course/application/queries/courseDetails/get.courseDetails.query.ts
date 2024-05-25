import {courseDetailsResponse} from './types/response'
import {courseDetailsDto} from './types/dto'
import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CourseRepository } from '../../repositories/course.repository'
import { ImageRepository } from '../../../../image/application/repositories/image.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { courseNotFoundError } from '../../errors/trainer.not.found.error'
import { imageNotFoundError } from 'src/category/application/errors/image.not.found'



export class GetCourseDetailsQuery
    implements ApplicationService<courseDetailsDto, courseDetailsResponse> 
{
    constructor(
        private courseRepo: CourseRepository,
        private imageRepo: ImageRepository,
    ){}
    async execute(
        data: courseDetailsDto,
    ): Promise<Result<courseDetailsResponse>> {

        const course = await this.courseRepo.getById(data.courseId)
        if (!isNotNull(course)) return Result.error(courseNotFoundError())
        const image = await this.imageRepo.getById(course.imageId)
        if (!isNotNull(image)) return Result.error(imageNotFoundError())

        return Result.success({
            title: course.title,
            description: course.description ,
            calories: course.calories,
            instructor: course.instructor,
            category: course.category,
            image: image.src,
        })
    }
}
