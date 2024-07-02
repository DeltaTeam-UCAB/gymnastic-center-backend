import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from './types/dto'
import { CreateCourseResponse } from './types/response'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { CourseRepository } from '../../repositories/course.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { DateProvider } from 'src/core/application/date/date.provider'
import { Course } from 'src/course/domain/course'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { Category } from 'src/course/domain/entities/category'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { CategoryRepository } from '../../repositories/category.repository'
import { CourseDate } from 'src/course/domain/value-objects/course.date'
import { CourseDescription } from 'src/course/domain/value-objects/course.description'
import { CourseImage } from 'src/course/domain/value-objects/course.image'
import { CourseLevel } from 'src/course/domain/value-objects/course.level'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { Trainer } from 'src/course/domain/entities/trainer'
import { CourseDuration } from 'src/course/domain/value-objects/course.duration'
import { CourseTag } from 'src/course/domain/value-objects/course.tag'
import { Lesson } from 'src/course/domain/entities/lesson'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { LessonContent } from 'src/course/domain/value-objects/lesson.content'
import { LessonTitle } from 'src/course/domain/value-objects/lesson.title'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'

export class CreateCourseCommand
    implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private courseRepository: CourseRepository,
        private categoryRepository: CategoryRepository,
        private trainerRepository: TrainerRepository,
        private dateProvider: DateProvider,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const courseId = this.idGenerator.generate()
        const course = new Course(new CourseID(courseId), {
            category: (await this.categoryRepository.getById(
                new CategoryID(data.category),
            )) as Category,
            creationDate: new CourseDate(this.dateProvider.current),
            description: new CourseDescription(data.description),
            image: new CourseImage(data.image),
            level: new CourseLevel(data.level),
            title: new CourseTitle(data.title),
            trainer: (await this.trainerRepository.getById(
                new TrainerID(data.trainer),
            )) as Trainer,
            duration: new CourseDuration(data.weeks, data.hours),
            tags: data.tags.map((t) => new CourseTag(t)),
            lessons: data.lessons
                .sort((a, b) => a.order - b.order)
                .map(
                    (e) =>
                        new Lesson(new LessonID(this.idGenerator.generate()), {
                            content: new LessonContent(e.content),
                            title: new LessonTitle(e.title),
                            video: new LessonVideo(e.video),
                        }),
                ),
        })
        const result = await this.courseRepository.save(course)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: courseId,
        })
    }
}
