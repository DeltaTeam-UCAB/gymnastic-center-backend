import { Optional } from '@mono/types-utils'
import { Image } from '../models/image'

export interface ImageRepository {
    getById(id: string): Promise<Optional<Image>>
}
