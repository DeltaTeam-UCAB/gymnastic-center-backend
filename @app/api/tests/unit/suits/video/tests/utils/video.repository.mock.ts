import { Optional } from '@mono/types-utils'
import { Video } from '../../../../../../src/video/application/models/video'
import { VideoRepository } from '../../../../../../src/video/application/repositories/video.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class VideoRepositoryMock implements VideoRepository {
    constructor(private videos: Video[] = []) {}
    async save(video: Video): Promise<Result<Video>> {
        this.videos = this.videos.filter((e) => e.id !== video.id)
        this.videos.push(video)
        return Result.success(video)
    }

    async getById(id: string): Promise<Optional<Video>> {
        return this.videos.find((e) => e.id === id)
    }

    async getAll(): Promise<Video[]> {
        return structuredClone(this.videos)
    }
}
