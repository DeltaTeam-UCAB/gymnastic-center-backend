import { Optional } from '@mono/types-utils'
import { Video } from '../models/video'

export interface VideoRepository {
    existById(id: string): Promise<boolean>
    getById(id: string): Promise<Optional<Video>>
}
