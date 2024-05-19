import { ApplicationService } from "src/core/application/service/application.service";
import { CreateCourseDTO } from "./types/dto";
import { CreateCourseResponse } from "./types/response";
import { IDGenerator } from "src/core/application/ID/ID.generator";
import { CourseRepository } from "../../repositories/course.repository";
import { Result } from "src/core/application/result-handler/result.handler";
import { Course } from "../../models/course";
import { courseTitleExistError } from "../../errors/course.title.exist";


export class CreateCourseCommand
implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private courseRepository: CourseRepository,
    ) {}
    async execute(data: CreateCourseDTO): Promise<Result<CreateCourseResponse>> {
        const isTitleExist = await this.courseRepository.existByTitle(data.title)
        if (isTitleExist) return Result.error(courseTitleExistError())
        const courseId = this.idGenerator.generate()
        const course = {
            ...data,
            id: courseId,
        } satisfies Course
        const result = await this.courseRepository.save(course)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: courseId,
        })
    }
}