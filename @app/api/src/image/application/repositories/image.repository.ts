import { Result } from 'src/core/application/result-handler/result.handler'
import { Image } from '../models/image'
import { Optional } from '@mono/types-utils'

export interface ImageRepository {
    save(video: Image): Promise<Result<Image>>
    getById(id: string): Promise<Optional<Image>>
    getAll(): Promise<Image[]>
}
