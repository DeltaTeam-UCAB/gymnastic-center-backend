import { Result } from 'src/core/application/result-handler/result.handler'
import { Video } from '../models/video'
import { Optional } from '@mono/types-utils'

export interface VideoRepository {
    save(video: Video): Promise<Result<Video>>
    getById(id: string): Promise<Optional<Video>>
    getAll(): Promise<Video[]>
}
