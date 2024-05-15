import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { DeleteVideoOptions } from '../../../../../../src/core/application/storage/video/types/delete.options'
import { SaveVideoOptions } from '../../../../../../src/core/application/storage/video/types/save.options'
import { VideoSaved } from '../../../../../../src/core/application/storage/video/types/saved'
import { VideoStorage } from '../../../../../../src/core/application/storage/video/video.manager'

export class VideoStorageMock implements VideoStorage {
    async save(options: SaveVideoOptions): Promise<Result<VideoSaved>> {
        return Result.success({
            url: options.path,
        })
    }
    async delete(options: DeleteVideoOptions): Promise<Result<VideoSaved>> {
        return Result.success({
            url: options.url,
        })
    }
}
