import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import { Result } from 'src/core/application/result-handler/result.handler'
import { ImageStorage } from 'src/core/application/storage/images/image.storage'
import { DeleteImageOptions } from 'src/core/application/storage/images/types/delete.options'
import { SaveImageOptions } from 'src/core/application/storage/images/types/save.options'
import { ImageSaved } from 'src/core/application/storage/images/types/saved'

@Injectable()
export class CloudinaryImageStorage implements ImageStorage {
    async save(options: SaveImageOptions): Promise<Result<ImageSaved>> {
        const data = await cloudinary.uploader.upload(options.path)
        return Result.success({
            url: data.url,
        })
    }

    async delete(options: DeleteImageOptions): Promise<Result<ImageSaved>> {
        await cloudinary.uploader.destroy(options.url, {
            type: 'url2png',
        })
        return Result.success({
            url: options.url,
        })
    }
}
