import { Optional } from '@mono/types-utils'
import { Video } from '../../../../../../src/course/application/models/video'
import { VideoRepository } from '../../../../../../src/course/application/repositories/video.repository'

export class VideoRepositoryMock implements VideoRepository {
    constructor(private videos: Video[] = []) {}
    async getById(id: string): Promise<Optional<Video>> {
        return this.videos.find((e) => e.id === id)
    }

    async existById(id: string): Promise<boolean> {
        return this.videos.some((e) => e.id === id)
    }
}
