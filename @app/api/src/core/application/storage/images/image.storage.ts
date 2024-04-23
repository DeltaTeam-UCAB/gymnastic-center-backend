import { DeleteImageOptions } from './types/delete.options'
import { ImageSaved } from './types/saved'
import { SaveImageOptions } from './types/save.options'
import { Result } from '../../result-handler/result.handler'

export interface ImageStorage {
    save(options: SaveImageOptions): Promise<Result<ImageSaved>>
    delete(options: DeleteImageOptions): Promise<Result<ImageSaved>>
}
