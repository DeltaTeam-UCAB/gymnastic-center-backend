import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import {
    CourseRepository,
    GetManyCoursesData,
} from 'src/course/application/repositories/course.repository'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { QueryRunner } from 'typeorm'
import { Lesson as LessonORM } from '../../models/postgres/lesson.entity'
import { Tag } from '../../models/postgres/tag.entity'
import { randomUUID } from 'crypto'
import { Course } from 'src/course/domain/course'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { Category } from 'src/course/domain/entities/category'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { CategoryName } from 'src/course/domain/value-objects/category.name'
import { Category as CategoryORM } from 'src/course/infraestructure/models/postgres/category.entity'
import { CourseDate } from 'src/course/domain/value-objects/course.date'
import { CourseDescription } from 'src/course/domain/value-objects/course.description'
import { CourseImage } from 'src/course/domain/value-objects/course.image'
import {
    CourseLevel,
    LEVELS,
} from 'src/course/domain/value-objects/course.level'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'
import { Trainer } from 'src/course/domain/entities/trainer'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { TrainerName } from 'src/course/domain/value-objects/trainer.name'
import { Trainer as TrainerORM } from 'src/course/infraestructure/models/postgres/trainer.entity'
import { CourseDuration } from 'src/course/domain/value-objects/course.duration'
import { CourseTag } from 'src/course/domain/value-objects/course.tag'
import { CourseTag as CourseTagORM } from 'src/course/infraestructure/models/postgres/course-tag.entity'
import { Lesson } from 'src/course/domain/entities/lesson'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { LessonContent } from 'src/course/domain/value-objects/lesson.content'
import { LessonTitle } from 'src/course/domain/value-objects/lesson.title'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'

export class CoursePostgresTransactionalRepository implements CourseRepository {
    constructor(private queryRunner: QueryRunner) {}

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
            weeks: course.duration.weeks,
            hours: course.duration.hours,
        }
        await this.queryRunner.manager.upsert(
            CourseORM,
            this.queryRunner.manager.create(CourseORM, courseORM),
            ['id'],
        )

        await course.lessons.asyncMap((e) =>
            this.queryRunner.manager.upsert(
                LessonORM,
                this.queryRunner.manager.create(LessonORM, {
                    id: e.id.id,
                    content: e.content.content,
                    video: e.video.video,
                    title: e.title.title || '',
                    courseId: course.id.id,
                    order: course.lessons.indexOf(e),
                }),
                ['id'],
            ),
        )
        const tagIds = await course.tags.asyncMap(async (t) => {
            const tagEntity = await this.queryRunner.manager.findOneBy(Tag, {
                name: t.tag,
            })
            if (tagEntity) return tagEntity.id
            const tagId = randomUUID()
            await this.queryRunner.manager.insert(Tag, {
                id: tagId,
                name: t.tag,
            })
            return tagId
        })
        await this.queryRunner.manager
            .delete(CourseTagORM, {
                courseId: course.id.id,
            })
            .catch(() => console.log('no tags'))
        await this.queryRunner.manager.insert(
            CourseTagORM,
            tagIds.map((e) => ({
                courseId: course.id.id,
                tagId: e,
            })),
        )
        return Result.success(course)
    }

    async getById(id: CourseID): Promise<Optional<Course>> {
        const course = await this.queryRunner.manager.findOneBy(CourseORM, {
            id: id.id,
        })
        if (!course) return undefined
        return new Course(id, {
            category: new Category(new CategoryID(course.category), {
                name: new CategoryName(
                    (
                        await this.queryRunner.manager.findOneByOrFail(
                            CategoryORM,
                            {
                                id: course.category,
                            },
                        )
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
                        await this.queryRunner.manager.findOneByOrFail(
                            TrainerORM,
                            {
                                id: course.trainer,
                            },
                        )
                    ).name,
                ),
            }),
            duration: new CourseDuration(course.weeks, course.hours),
            tags: await this.queryRunner.manager
                .findBy(CourseTagORM, {
                    courseId: course.id,
                })
                .map(
                    async (tagId) =>
                        new CourseTag(
                            (
                                await this.queryRunner.manager.findOneByOrFail(
                                    Tag,
                                    {
                                        id: tagId.tagId,
                                    },
                                )
                            ).name,
                        ),
                ),
            lessons: (
                await this.queryRunner.manager.findBy(LessonORM, {
                    courseId: course.id,
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
        return this.queryRunner.manager.existsBy(CourseORM, {
            title: title.title,
        })
    }

    async many(data: GetManyCoursesData): Promise<Course[]> {
        const courses = await this.queryRunner.manager.find(CourseORM, {
            skip: data.perPage * (data.page - 1),
            take: data.perPage,
        })
        return courses.asyncMap(
            async (e) =>
                new Course(new CourseID(e.id), {
                    category: new Category(new CategoryID(e.category), {
                        name: new CategoryName(
                            (
                                await this.queryRunner.manager.findOneByOrFail(
                                    CategoryORM,
                                    {
                                        id: e.category,
                                    },
                                )
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
                                await this.queryRunner.manager.findOneByOrFail(
                                    TrainerORM,
                                    {
                                        id: e.trainer,
                                    },
                                )
                            ).name,
                        ),
                    }),
                    duration: new CourseDuration(e.weeks, e.hours),
                }),
        )
    }
}
