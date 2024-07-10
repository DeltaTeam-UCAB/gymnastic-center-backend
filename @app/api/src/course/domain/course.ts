import { AggregateRoot } from 'src/core/domain/aggregates/aggregate.root'
import { CourseID } from './value-objects/course.id'
import { CourseTitle } from './value-objects/course.title'
import { CourseDescription } from './value-objects/course.description'
import { CourseDuration } from './value-objects/course.duration'
import { CourseLevel } from './value-objects/course.level'
import { CourseTag } from './value-objects/course.tag'
import { Lesson } from './entities/lesson'
import { Trainer } from './entities/trainer'
import { Category } from './entities/category'
import { CourseImage } from './value-objects/course.image'
import { CourseDate } from './value-objects/course.date'
import { unvalidCourse } from './exceptions/unvalid.course'
import { courseCreated } from './events/course.created'
import { courseTitleChanged } from './events/course.title.changed'
import { courseDescriptionChanged } from './events/course.description.changed'
import { courseImageChanged } from './events/course.image.changed'
import { courseLevelChanged } from './events/course.level.changed'
import { courseDurationChanged } from './events/course.duration.changed'
import { courseCategoryChanged } from './events/course.category.changed'
import { courseTrainerChanged } from './events/course.trainer.changed'
import { courseTagAdded } from './events/course.tag.added'
import { courseTagRemoved } from './events/course.tag.removed'
import { courseDeleted } from './events/course.deleted'
import { lessonExist } from './exceptions/lesson.exist'
import { courseLessonAdded } from './events/course.lesson.added'
import { LessonID } from './value-objects/lesson.id'
import { lessonNotExist } from './exceptions/lesson.not.exist'
import { courseLessonRemoved } from './events/course.lesson.removed'

export class Course extends AggregateRoot<CourseID> {
    constructor(
        id: CourseID,
        private data: {
            title: CourseTitle
            description: CourseDescription
            duration: CourseDuration
            level: CourseLevel
            tags?: CourseTag[]
            lessons?: Lesson[]
            trainer: Trainer
            category: Category
            image: CourseImage
            creationDate: CourseDate
        },
    ) {
        if (!data.lessons) data.lessons = []
        if (!data.tags) data.tags = []
        super(id)
        this.publish(
            courseCreated({
                id,
                ...data,
                lessons: this.lessons,
                tags: this.tags,
            }),
        )
    }

    get title() {
        return this.data.title
    }

    get description() {
        return this.data.description
    }

    get duration() {
        return this.data.duration
    }

    get level() {
        return this.data.level
    }

    get tags() {
        return [...this.data.tags!]
    }

    get image() {
        return this.data.image
    }

    get lessons() {
        return this.data.lessons!.map((e) => e.clone())
    }

    get category() {
        return this.data.category.clone()
    }

    get trainer() {
        return this.data.trainer.clone()
    }

    get creationDate() {
        return this.data.creationDate
    }

    changeTitle(title: CourseTitle) {
        this.data.title = title
        this.publish(
            courseTitleChanged({
                id: this.id,
                title,
            }),
        )
    }

    changeDescription(description: CourseDescription) {
        this.data.description = description
        this.publish(
            courseDescriptionChanged({
                id: this.id,
                description: description,
            }),
        )
    }

    changeImage(image: CourseImage) {
        this.data.image = image
        this.publish(
            courseImageChanged({
                id: this.id,
                image,
            }),
        )
    }

    changeLevel(level: CourseLevel) {
        this.data.level = level
        this.publish(
            courseLevelChanged({
                id: this.id,
                level,
            }),
        )
    }

    changeDuration(duration: CourseDuration) {
        this.data.duration = duration
        this.publish(
            courseDurationChanged({
                id: this.id,
                duration,
            }),
        )
    }

    changeCategory(category: Category) {
        this.data.category = category
        this.publish(
            courseCategoryChanged({
                id: this.id,
                category,
            }),
        )
    }

    changeTrainer(trainer: Trainer) {
        this.data.trainer = trainer
        this.publish(
            courseTrainerChanged({
                id: this.id,
                trainer,
            }),
        )
    }

    addTag(tag: CourseTag) {
        this.data.tags?.push(tag)
        this.publish(
            courseTagAdded({
                id: this.id,
                tag,
            }),
        )
    }

    removeTag(tag: CourseTag) {
        this.data.tags = this.data.tags?.filter((e) => e != tag)
        this.publish(
            courseTagRemoved({
                id: this.id,
                tag,
            }),
        )
    }

    addLesson(lesson: Lesson) {
        if (this.lessons.some((e) => e.id == lesson.id)) throw lessonExist()
        this.data.lessons?.push(lesson)
        this.publish(
            courseLessonAdded({
                id: this.id,
                lesson,
            }),
        )
    }

    removeLesson(lessonId: LessonID) {
        if (!this.lessons.some((e) => e.id == lessonId)) throw lessonNotExist()
        this.data.lessons = this.lessons.filter((e) => e.id != lessonId)
        this.publish(
            courseLessonRemoved({
                id: this.id,
                lesson: lessonId,
            }),
        )
    }

    delete() {
        this.publish(
            courseDeleted({
                id: this.id,
            }),
        )
    }

    validateState(): void {
        if (
            !this.id ||
            !this.tags ||
            !this.lessons ||
            !this.title ||
            !this.description ||
            !this.level ||
            !this.duration ||
            !this.category ||
            !this.trainer ||
            !this.creationDate
        )
            throw unvalidCourse()
    }
}
