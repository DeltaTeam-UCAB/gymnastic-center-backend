import { Course } from '../../../../../../src/course/domain/course'
import { Category } from '../../../../../../src/course/domain/entities/category'
import { CategoryID } from '../../../../../../src/course/domain/value-objects/category.id'
import { Lesson } from '../../../../../../src/course/domain/entities/lesson'
import { Trainer } from '../../../../../../src/course/domain/entities/trainer'
import { CourseDescription } from '../../../../../../src/course/domain/value-objects/course.description'
import { CourseID } from '../../../../../../src/course/domain/value-objects/course.id'
import { CourseTitle } from '../../../../../../src/course/domain/value-objects/course.title'
import { TrainerID } from '../../../../../../src/course/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../../src/course/domain/value-objects/trainer.name'
import { CategoryName } from '../../../../../../src/course/domain/value-objects/category.name'
import {
    CourseLevel,
    LEVELS,
} from '../../../../../../src/course/domain/value-objects/course.level'
import { CourseImage } from '../../../../../../src/course/domain/value-objects/course.image'
import { CourseDuration } from '../../../../../../src/course/domain/value-objects/course.duration'
import { CourseDate } from '../../../../../../src/course/domain/value-objects/course.date'
import { CourseTag } from '../../../../../../src/course/domain/value-objects/course.tag'

export const createCourse = (data: {
    id?: string
    title?: string
    description?: string
    trainer: {
        id?: string
        name?: string
    }
    creationDate?: Date
    category: {
        id?: string
        name?: string
    }
    videoId?: string
    imageId: string
    level?: LEVELS
    weeks?: number
    hours?: number
    lessons?: Lesson[]
    tags?: string[]
}): Course =>
    new Course(
        new CourseID(data?.id ?? '75db8fcd-76a0-4ddf-932a-30b63cddb0ba'),
        {
            title: new CourseTitle(data?.title ?? 'test course'),
            description: new CourseDescription(
                data?.description ?? 'test made for course description',
            ),
            trainer: new Trainer(
                new TrainerID(
                    data.trainer?.id ?? '49e7a373-4673-4c7b-8e42-ac2ec5e26f3a',
                ),
                {
                    name: new TrainerName(
                        data.trainer?.name ?? 'trainer test name',
                    ),
                },
            ),
            category: new Category(
                new CategoryID(
                    data.category?.id ?? '96754fe6-36f5-42e7-b9ba-6df2363986ef',
                ),
                {
                    name: new CategoryName(
                        data.category?.name ?? 'category test name',
                    ),
                },
            ),
            level: new CourseLevel(data?.level ?? 'EASY'),
            image: new CourseImage(
                data?.imageId ?? '89d79906-208b-4018-8486-ba5e77c0a28a',
            ),
            duration: new CourseDuration(data.weeks ?? 4, data.hours ?? 40),
            creationDate: new CourseDate(data.creationDate ?? new Date()),
            lessons: data.lessons ?? [],
            tags: data.tags ? data.tags.map((t) => new CourseTag(t)) : [],
        },
    )
