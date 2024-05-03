import { Result } from 'src/core/application/result-handler/result.handler'
import { DeleteVideoOptions } from 'src/core/application/storage/video/types/delete.options'
import { SaveVideoOptions } from 'src/core/application/storage/video/types/save.options'
import { VideoSaved } from 'src/core/application/storage/video/types/saved'
import { VideoStorage } from 'src/core/application/storage/video/video.manager'
import { v2 as cloudinary } from 'cloudinary'
import { Injectable } from '@nestjs/common'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

@Injectable()
export class CloudinaryVideoStorage implements VideoStorage {
    async save(options: SaveVideoOptions): Promise<Result<VideoSaved>> {
        const result = await cloudinary.uploader.upload(options.path, {
            resource_type: 'video',
        })
        return Result.success<VideoSaved>({
            url: result.secure_url || result.url,
        })
    }
    async delete(options: DeleteVideoOptions): Promise<Result<VideoSaved>> {
        await cloudinary.uploader.destroy(options.url)
        return Result.success<VideoSaved>({
            url: options.url,
        })
    }
}
