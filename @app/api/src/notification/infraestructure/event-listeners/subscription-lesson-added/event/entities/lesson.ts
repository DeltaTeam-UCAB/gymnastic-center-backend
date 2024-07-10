import { Entity } from 'src/core/domain/entity/entity'
import { LessonID } from '../value-objects/lesson.id'
import { LessonLastTime } from '../value-objects/lesson.last.time'
import { LessonProgress } from '../value-objects/lesson.progress'
import { unvalidProgress } from '../exceptions/unvalid.progress'

export class Lesson extends Entity<LessonID> {
    constructor(
        id: LessonID,
        private data: {
            lastTime?: LessonLastTime
            progress: LessonProgress
        },
    ) {
        super(id)
    }

    get lastTime() {
        return this.data.lastTime
    }

    get progress() {
        return this.data.progress
    }

    changeLastTime(lastTime: LessonLastTime) {
        this.data.lastTime = lastTime
    }

    changeProgress(progress: LessonProgress) {
        if (this.progress > progress) throw unvalidProgress()
        this.data.progress = progress
    }
}
