import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { DeleteImageOptions } from '../../../../../../src/core/application/storage/images/types/delete.options'
import { SaveImageOptions } from '../../../../../../src/core/application/storage/images/types/save.options'
import { ImageSaved } from '../../../../../../src/core/application/storage/images/types/saved'
import { ImageStorage } from '../../../../../../src/core/application/storage/images/image.storage'

export class ImageStorageMock implements ImageStorage {
    async save(options: SaveImageOptions): Promise<Result<ImageSaved>> {
        return Result.success({
            url: options.path,
        })
    }
    async delete(options: DeleteImageOptions): Promise<Result<ImageSaved>> {
        return Result.success({
            url: options.url,
        })
    }
}
