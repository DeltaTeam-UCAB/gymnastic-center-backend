import { Optional } from '@mono/types-utils'
import { Video } from '../../../../../../src/course/application/models/video'
import { VideoRepository } from '../../../../../../src/course/application/repositories/video.repository'
import { LessonVideo } from '../../../../../../src/course/domain/value-objects/lesson.video'

export class VideoRepositoryMock implements VideoRepository {
    constructor(private videos: Video[] = []) {}
    async getById(id: LessonVideo): Promise<Optional<Video>> {
        return this.videos.find((e) => e.id === id.video)
    }

    async existById(id: LessonVideo): Promise<boolean> {
        return this.videos.some((e) => e.id === id.video)
    }
}
