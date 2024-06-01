import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from 'src/course/application/models/course'
import {
    CourseRepository,
    GetManyCoursesData,
} from 'src/course/application/repositories/course.repository'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { QueryRunner } from 'typeorm'
import { Lesson } from '../../models/postgres/lesson.entity'
import { Tag } from '../../models/postgres/tag.entity'
import { randomUUID } from 'crypto'
import { CourseTag } from '../../models/postgres/course-tag.entity'

export class CoursePostgresTransactionalRepository implements CourseRepository {
    constructor(private queryRunner: QueryRunner) {}

    async save(course: Course): Promise<Result<Course>> {
        await this.queryRunner.manager.upsert(
            CourseORM,
            this.queryRunner.manager.create(CourseORM, course),
            ['id'],
        )
        await course.lessons.asyncMap((e) =>
            this.queryRunner.manager.upsert(
                Lesson,
                this.queryRunner.manager.create(Lesson, {
                    ...e,
                    title: e.title || '',
                    courseId: course.id,
                }),
                ['id'],
            ),
        )

        const tagIds = await course.tags.asyncMap(async (name) => {
            const tagEntity = await this.queryRunner.manager.findOneBy(Tag, {
                name,
            })
            if (tagEntity) return tagEntity.id
            const tagId = randomUUID()
            await this.queryRunner.manager.insert(Tag, {
                id: tagId,
                name,
            })
            return tagId
        })
        await this.queryRunner.manager
            .delete(CourseTag, {
                courseId: course.id,
            })
            .catch(() => console.log('no tags'))
        await this.queryRunner.manager.insert(
            CourseTag,
            tagIds.map((e) => ({
                courseId: course.id,
                tagId: e,
            })),
        )
        return Result.success(course)
    }

    async getById(id: string): Promise<Optional<Course>> {
        const course = await this.queryRunner.manager.findOneBy(CourseORM, {
            id,
        })
        if (!course) return undefined
        return {
            ...course,
            tags: await this.queryRunner.manager
                .findBy(CourseTag, {
                    courseId: course.id,
                })
                .map(
                    async (tagId) =>
                        (
                            await this.queryRunner.manager.findOneByOrFail(
                                Tag,
                                {
                                    id: tagId.tagId,
                                },
                            )
                        ).name,
                ),
            lessons: await this.queryRunner.manager
                .findBy(Lesson, {
                    courseId: course.id,
                })
                .map((e) => ({
                    order: e.order,
                    id: e.id,
                    title: e.title,
                    content: e.content,
                    video: e.video,
                    image: e.image,
                })),
        }
    }

    existByTitle(title: string): Promise<boolean> {
        return this.queryRunner.manager.existsBy(CourseORM, {
            title,
        })
    }

    async many(data: GetManyCoursesData): Promise<Course[]> {
        const courses = await this.queryRunner.manager.find(CourseORM, {
            skip: data.perPage * (data.page - 1),
            take: data.perPage,
        })
        return courses.map((e) => ({
            ...e,
            lessons: [],
            tags: [],
        }))
    }
}
