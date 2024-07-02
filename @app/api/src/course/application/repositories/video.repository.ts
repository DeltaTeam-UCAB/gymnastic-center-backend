import { Optional } from '@mono/types-utils'
import { Video as VideoModel } from '../models/video'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'

export interface VideoRepository {
    existById(id: LessonVideo): Promise<boolean>
    getById(id: LessonVideo): Promise<Optional<VideoModel>>
}
