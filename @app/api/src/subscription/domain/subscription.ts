import { AggregateRoot } from 'src/core/domain/aggregates/aggregate.root'
import { SubscriptionID } from './value-objects/subscription.id'
import { ClientID } from './value-objects/client.id'
import { CourseID } from './value-objects/course.id'
import { Time } from './value-objects/time'
import { Lesson } from './entities/lesson'
import { unvalidCourse } from 'src/course/domain/exceptions/unvalid.course'
import { LessonID } from './value-objects/lesson.id'
import { LessonLastTime } from './value-objects/lesson.last.time'
import { lessonNotFound } from './exceptions/lesson.not.found'
import { LessonProgress } from './value-objects/lesson.progress'
import { subscriptionCreated } from './events/subscription.created'
import { lastTimeChanged } from './events/last.time.changed'
import { lessonLastTimeChanged } from './events/lesson.last.time.changed'
import { lessonProgressChanged } from './events/lesson.progress.changed'
import { subscriptionDeleted } from './events/subscription.deleted'
import { lessonExist } from './exceptions/lesson.exist'
import { lessonNotExist } from './exceptions/lesson.not.exist'
import { lessonAdded } from './events/subscription.lesson.added'
import { lessonRemoved } from './events/subscription.lesson.removed'

export class Subscription extends AggregateRoot<SubscriptionID> {
    constructor(
        id: SubscriptionID,
        private data: {
            client: ClientID
            course: CourseID
            startTime: Time
            lastTime: Time
            lessons: Lesson[]
        },
    ) {
        super(id)
        this.publish(
            subscriptionCreated({
                id,
                ...data,
            }),
        )
    }

    get client() {
        return this.data.client
    }

    get course() {
        return this.data.course
    }

    get startTime() {
        return this.data.startTime
    }

    get lastTime() {
        return this.data.lastTime
    }

    get lessons() {
        return this.data.lessons.map((e) => e.clone())
    }

    changeLastTime(lastTime: Time) {
        this.data.lastTime = lastTime
        this.validateState()
        this.publish(
            lastTimeChanged({
                id: this.id,
                lastTime,
            }),
        )
    }

    changeLessonLastTime(lessonId: LessonID, lastTime: LessonLastTime) {
        const lesson = this.data.lessons.find((e) => e.id == lessonId)
        if (!lesson) throw lessonNotFound()
        lesson.changeLastTime(lastTime)
        this.publish(
            lessonLastTimeChanged({
                id: this.id,
                lessonId,
                lastTime,
            }),
        )
    }

    changeLessonProgress(lessonId: LessonID, progress: LessonProgress) {
        const lesson = this.data.lessons.find((e) => e.id == lessonId)
        if (!lesson) throw lessonNotFound()
        lesson.changeProgress(progress)
        this.publish(
            lessonProgressChanged({
                id: this.id,
                lessonId,
                progress,
            }),
        )
    }

    addLesson(lesson: Lesson) {
        if (this.lessons.some((e) => e.id == lesson.id)) throw lessonExist()
        this.data.lessons?.push(lesson)
        this.publish(
            lessonAdded({
                id: this.id,
                lesson,
            }),
        )
    }

    removeLesson(lessonId: LessonID) {
        if (!this.lessons.some((e) => e.id == lessonId)) throw lessonNotExist()
        this.data.lessons = this.lessons.filter((e) => e.id != lessonId)
        this.publish(
            lessonRemoved({
                id: this.id,
                lesson: lessonId,
            }),
        )
    }

    delete() {
        this.publish(
            subscriptionDeleted({
                id: this.id,
            }),
        )
    }

    validateState(): void {
        if (
            !this.id ||
            !this.client ||
            !this.course ||
            !this.startTime ||
            !this.lastTime ||
            !this.lessons ||
            this.lastTime < this.startTime
        )
            throw unvalidCourse()
    }
}
