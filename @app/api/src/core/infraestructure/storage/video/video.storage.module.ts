import { ServiceModule } from '../../decorators/service.module'
import { CloudinaryVideoStorage } from './service/cloudinary.video.storage'

export const CLOUDINARY_VIDEO_STORAGE = 'CLOUDINARY_VIDEO_STORAGE'

@ServiceModule([
    {
        provide: CLOUDINARY_VIDEO_STORAGE,
        useClass: CloudinaryVideoStorage,
    },
])
export class VideoStorageModule {}
