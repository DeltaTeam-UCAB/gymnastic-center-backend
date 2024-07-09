import { Optional } from '@mono/types-utils'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { Video } from 'src/course/application/models/video'
import { VideoRepository } from 'src/course/application/repositories/video.repository'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'

export class VideoRedisRepositoryProxy implements VideoRepository {
    constructor(private videoRepository: VideoRepository) {}
    async getById(id: LessonVideo): Promise<Optional<Video>> {
        const possibleVideo = (await redisClient.hGetAll(
            'video:' + id.video,
        )) as Optional<{
            id: string
            src: string
        }>
        if (possibleVideo?.id) return possibleVideo
        const video = await this.videoRepository.getById(id)
        if (video) await redisClient.hSet('video:' + id.video, video)
        return video
    }

    existById(id: LessonVideo): Promise<boolean> {
        return this.videoRepository.existById(id)
    }
}
