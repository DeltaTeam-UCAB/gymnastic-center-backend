import { Result } from '../../result-handler/result.handler'
import { DeleteVideoOptions } from './types/delete.options'
import { SaveVideoOptions } from './types/save.options'
import { VideoSaved } from './types/saved'

export interface VideoStorage {
    save(options: SaveVideoOptions): Promise<Result<VideoSaved>>
    delete(options: DeleteVideoOptions): Promise<Result<VideoSaved>>
}
