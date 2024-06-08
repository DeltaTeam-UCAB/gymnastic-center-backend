import { Entity } from 'src/core/domain/entity/entity'
import { LessonID } from '../value-objects/lesson.id'
import { LessonContent } from '../value-objects/lesson.content'
import { LessonImage } from '../value-objects/lesson.image'
import { LessonVideo } from '../value-objects/lesson.video'
import { LessonTitle } from '../value-objects/lesson.title'

export class Lesson extends Entity<LessonID> {
    constructor(
        id: LessonID,
        private data: {
            title: LessonTitle
            content: LessonContent
            image?: LessonImage
            video?: LessonVideo
        },
    ) {
        super(id)
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

    get image() {
        return this.data.image
    }

    changeTitle(title: LessonTitle) {
        this.data.title = title
    }

    changeContent(content: LessonContent) {
        this.data.content = content
    }

    changeImage(image: LessonImage) {
        this.data.image = image
    }

    changeVideo(video: LessonVideo) {
        this.data.video = video
    }
}
