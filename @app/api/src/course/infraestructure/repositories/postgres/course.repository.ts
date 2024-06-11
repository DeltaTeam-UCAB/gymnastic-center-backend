import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Course } from 'src/course/application/models/course'
import {
    CourseRepository,
    GetManyCoursesData,
} from 'src/course/application/repositories/course.repository'
import { Course as UserORM } from '../../models/postgres/course.entity'
import { Repository } from 'typeorm'
import { Lesson } from '../../models/postgres/lesson.entity'
import { Tag } from '../../models/postgres/tag.entity'
import { randomUUID } from 'crypto'
import { CourseTag } from '../../models/postgres/course-tag.entity'

@Injectable()
export class CoursePostgresRepository implements CourseRepository {
    constructor(
        @InjectRepository(UserORM) private courseProvider: Repository<UserORM>,
        @InjectRepository(Lesson) private lessonProvider: Repository<Lesson>,
        @InjectRepository(Tag) private tagProvider: Repository<Tag>,
        @InjectRepository(CourseTag)
        private courseTagProvider: Repository<CourseTag>,
    ) {}

    async save(course: Course): Promise<Result<Course>> {
        await this.courseProvider.upsert(this.courseProvider.create(course), [
            'id',
        ])
        await course.lessons.asyncMap((e) =>
            this.lessonProvider.upsert(
                this.lessonProvider.create({
                    ...e,
                    title: e.title || '',
                    courseId: course.id,
                }),
                ['id'],
            ),
        )

        const tagIds = await course.tags.asyncMap(async (name) => {
            const tagEntity = await this.tagProvider.findOneBy({
                name,
            })
            if (tagEntity) return tagEntity.id
            const tagId = randomUUID()
            await this.tagProvider.insert({
                id: tagId,
                name,
            })
            return tagId
        })
        await this.courseTagProvider
            .delete({
                courseId: course.id,
            })
            .catch(() => console.log('no tags'))
        await this.courseTagProvider.insert(
            tagIds.map((e) => ({
                courseId: course.id,
                tagId: e,
            })),
        )
        return Result.success(course)
    }

    async getById(id: string): Promise<Optional<Course>> {
        const course = await this.courseProvider.findOneBy({
            id,
        })
        if (!course) return undefined
        return {
            ...course,
            tags: await this.courseTagProvider
                .findBy({
                    courseId: course.id,
                })
                .map(
                    async (tagId) =>
                        (
                            await this.tagProvider.findOneByOrFail({
                                id: tagId.tagId,
                            })
                        ).name,
                ),
            lessons: await this.lessonProvider
                .findBy({
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
        return this.courseProvider.existsBy({
            title,
        })
    }

    async many(data: GetManyCoursesData): Promise<Course[]> {
        const courses = await this.courseProvider.find({
            skip: data.perPage * (data.page - 1),
            take: data.perPage,
            where: {
                category: data.category,
                trainer: data.trainer,
            },
        })
        return courses.map((e) => ({
            ...e,
            lessons: [],
            tags: [],
        }))
    }
}
