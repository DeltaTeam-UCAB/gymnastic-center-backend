import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import {
    CourseRepository,
    GetManyCoursesData,
} from 'src/course/application/repositories/course.repository'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { Lesson as LessonORM } from '../../models/postgres/lesson.entity'
import { Tag } from '../../models/postgres/tag.entity'
import { randomUUID } from 'crypto'
import { CourseTag as CourseTagORM } from '../../models/postgres/course-tag.entity'
import { Course } from 'src/course/domain/course'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { Category } from 'src/course/domain/entities/category'
import { Trainer } from 'src/course/domain/entities/trainer'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { Category as CategoryORM } from 'src/course/infraestructure/models/postgres/category.entity'
import { CourseDate } from 'src/course/domain/value-objects/course.date'
import { CourseDescription } from 'src/course/domain/value-objects/course.description'
import { CourseDuration } from 'src/course/domain/value-objects/course.duration'
import { CourseImage } from 'src/course/domain/value-objects/course.image'
import {
    CourseLevel,
    LEVELS,
} from 'src/course/domain/value-objects/course.level'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'
import { Trainer as TrainerORM } from 'src/course/infraestructure/models/postgres/trainer.entity'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { CategoryName } from 'src/course/domain/value-objects/category.name'
import { TrainerName } from 'src/course/domain/value-objects/trainer.name'
import { CourseTag } from 'src/course/domain/value-objects/course.tag'
import { Lesson } from 'src/course/domain/entities/lesson'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { LessonContent } from 'src/course/domain/value-objects/lesson.content'
import { LessonTitle } from 'src/course/domain/value-objects/lesson.title'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'

@Injectable()
export class CoursePostgresRepository implements CourseRepository {
    constructor(
        @InjectRepository(CourseORM)
        private courseProvider: Repository<CourseORM>,
        @InjectRepository(LessonORM)
        private lessonProvider: Repository<LessonORM>,
        @InjectRepository(Tag) private tagProvider: Repository<Tag>,
        @InjectRepository(CategoryORM)
        private categoryProvider: Repository<CategoryORM>,
        @InjectRepository(TrainerORM)
        private trainerProvider: Repository<TrainerORM>,
        @InjectRepository(CourseTagORM)
        private courseTagProvider: Repository<CourseTagORM>,
    ) {}

    async save(course: Course): Promise<Result<Course>> {
        const courseORM = {
            id: course.id.id,
            title: course.title.title,
            description: course.description.description,
            trainer: course.trainer.id.id,
            date: course.creationDate.date,
            category: course.category.id.id,
            image: course.image.image,
            level: course.level.level,
        }
        await this.courseProvider.upsert(
            this.courseProvider.create(courseORM),
            ['id'],
        )
        await this.lessonProvider.update(
            {
                courseId: course.id.id,
            },
            {
                active: false,
            },
        )
        await course.lessons.asyncMap((e) =>
            this.lessonProvider.upsert(
                this.lessonProvider.create({
                    id: e.id.id,
                    content: e.content.content,
                    video: e.video.video,
                    title: e.title.title || '',
                    courseId: course.id.id,
                    order: course.lessons.indexOf(e),
                    active: true,
                }),
                ['id'],
            ),
        )
        const tagIds = await course.tags.asyncMap(async (t) => {
            const tagEntity = await this.tagProvider.findOneBy({
                name: t.tag,
            })
            if (tagEntity) return tagEntity.id
            const tagId = randomUUID()
            await this.tagProvider.insert({
                id: tagId,
                name: t.tag,
            })
            return tagId
        })
        await this.courseTagProvider
            .delete({
                courseId: course.id.id,
            })
            .catch(() => console.log('no tags'))
        await this.courseTagProvider.insert(
            tagIds.map((e) => ({
                courseId: course.id.id,
                tagId: e,
            })),
        )
        return Result.success(course)
    }

    async getById(id: CourseID): Promise<Optional<Course>> {
        const course = await this.courseProvider.findOneBy({
            id: id.id,
            available: true,
        })
        if (!course) return undefined
        return new Course(id, {
            category: new Category(new CategoryID(course.category), {
                name: new CategoryName(
                    (
                        await this.categoryProvider.findOneByOrFail({
                            id: course.category,
                        })
                    ).name,
                ),
            }),
            creationDate: new CourseDate(course.date),
            description: new CourseDescription(course.description),
            image: new CourseImage(course.image),
            level: new CourseLevel(course.level as LEVELS),
            title: new CourseTitle(course.title),
            trainer: new Trainer(new TrainerID(course.trainer), {
                name: new TrainerName(
                    (
                        await this.trainerProvider.findOneByOrFail({
                            id: course.trainer,
                        })
                    ).name,
                ),
            }),
            duration: new CourseDuration(course.weeks, course.hours),
            tags: await this.courseTagProvider
                .findBy({
                    courseId: course.id,
                })
                .map(
                    async (tagId) =>
                        new CourseTag(
                            (
                                await this.tagProvider.findOneByOrFail({
                                    id: tagId.tagId,
                                })
                            ).name,
                        ),
                ),
            lessons: (
                await this.lessonProvider.findBy({
                    courseId: course.id,
                    active: true,
                })
            )
                .sort((a, b) => a.order - b.order)
                .map(
                    (e) =>
                        new Lesson(new LessonID(e.id), {
                            content: new LessonContent(e.content),
                            title: new LessonTitle(e.title),
                            video: new LessonVideo(e.video),
                        }),
                ),
        })
    }

    existByTitle(title: CourseTitle): Promise<boolean> {
        return this.courseProvider.existsBy({
            title: title.title,
            available: true,
        })
    }

    async many(data: GetManyCoursesData): Promise<Course[]> {
        const courses = await this.courseProvider.find({
            skip: data.perPage * (data.page - 1),
            take: data.perPage,
            where: {
                category: data.category?.id,
                trainer: data.trainer?.id,
                available: true,
            },
        })
        return courses.asyncMap(
            async (e) =>
                new Course(new CourseID(e.id), {
                    category: new Category(new CategoryID(e.category), {
                        name: new CategoryName(
                            (
                                await this.categoryProvider.findOneByOrFail({
                                    id: e.category,
                                })
                            ).name,
                        ),
                    }),
                    creationDate: new CourseDate(e.date),
                    description: new CourseDescription(e.description),
                    image: new CourseImage(e.image),
                    level: new CourseLevel(e.level as LEVELS),
                    title: new CourseTitle(e.title),
                    trainer: new Trainer(new TrainerID(e.trainer), {
                        name: new TrainerName(
                            (
                                await this.trainerProvider.findOneByOrFail({
                                    id: e.trainer,
                                })
                            ).name,
                        ),
                    }),
                    duration: new CourseDuration(e.weeks, e.hours),
                }),
        )
    }
    async countByTrainer(id: TrainerID): Promise<number> {
        const courses = this.courseProvider.countBy({
            trainer: id.id,
            available: true,
        })
        return courses
    }
    async countByCategory(id: CategoryID): Promise<number> {
        const courses = this.courseProvider.countBy({
            category: id.id,
            available: true,
        })
        return courses
    }

    async delete(course: Course): Promise<Result<Course>> {
        await this.courseProvider.update(
            {
                id: course.id.id,
            },
            {
                available: false,
            },
        )
        await this.lessonProvider.update(
            {
                courseId: course.id.id,
            },
            {
                active: false,
            },
        )
        return Result.success(course)
    }

    async getAllByTrainer(id: TrainerID): Promise<Course[]> {
        const courses = await this.courseProvider.find({
            where: {
                trainer: id.id,
                available: true,
            },
        })
        return courses.asyncMap(
            async (e) =>
                new Course(new CourseID(e.id), {
                    category: new Category(new CategoryID(e.category), {
                        name: new CategoryName(
                            (
                                await this.categoryProvider.findOneByOrFail({
                                    id: e.category,
                                })
                            ).name,
                        ),
                    }),
                    creationDate: new CourseDate(e.date),
                    description: new CourseDescription(e.description),
                    image: new CourseImage(e.image),
                    level: new CourseLevel(e.level as LEVELS),
                    title: new CourseTitle(e.title),
                    trainer: new Trainer(new TrainerID(e.trainer), {
                        name: new TrainerName(
                            (
                                await this.trainerProvider.findOneByOrFail({
                                    id: e.trainer,
                                })
                            ).name,
                        ),
                    }),
                    duration: new CourseDuration(e.weeks, e.hours),
                }),
        )
    }
}
