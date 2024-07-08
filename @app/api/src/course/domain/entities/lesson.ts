import { Entity } from 'src/core/domain/entity/entity'
import { LessonID } from '../value-objects/lesson.id'
import { LessonContent } from '../value-objects/lesson.content'
import { LessonVideo } from '../value-objects/lesson.video'
import { LessonTitle } from '../value-objects/lesson.title'
import { Clonable } from 'src/core/domain/clonable/clonable'

export class Lesson extends Entity<LessonID> implements Clonable<Lesson> {
    constructor(
        id: LessonID,
        private data: {
            title: LessonTitle
            content: LessonContent
            video: LessonVideo
        },
    ) {
        super(id)
    }

    clone(): Lesson {
        return new Lesson(this.id, this.data)
    }

    get title() {
        return this.data.title
    }

    get content() {
        return this.data.content
    }

    get video() {
        return this.data.video
    }

    changeTitle(title: LessonTitle) {
        this.data.title = title
    }

    changeContent(content: LessonContent) {
        this.data.content = content
    }

    changeVideo(video: LessonVideo) {
        this.data.video = video
    }
}
