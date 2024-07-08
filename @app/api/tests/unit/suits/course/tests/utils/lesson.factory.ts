import { Lesson } from '../../../../../../src/course/domain/entities/lesson'
import { LessonContent } from '../../../../../../src/course/domain/value-objects/lesson.content'
import { LessonID } from '../../../../../../src/course/domain/value-objects/lesson.id'
import { LessonTitle } from '../../../../../../src/course/domain/value-objects/lesson.title'
import { LessonVideo } from '../../../../../../src/course/domain/value-objects/lesson.video'

export const createLesson = (data?: {
    id?: string
    title?: string
    content?: string
    video?: string
}): Lesson =>
    new Lesson(new LessonID(data?.id ?? '123456789'), {
        title: new LessonTitle(data?.title ?? 'test lesson'),
        content: new LessonContent(data?.content ?? 'test content'),
        video: new LessonVideo(
            data?.video ?? '48efda30-7829-4632-8d81-14968ceafc27',
        ),
    })
