import { ServiceModule } from '../../decorators/service.module'
import { CloudinaryImageStorage } from './service/cloudinary.image.storage'

export const CLOUDINARY_IMAGE_STORAGE = 'CLOUDINARY_IMAGE_STORAGE'

@ServiceModule([
    {
        provide: CLOUDINARY_IMAGE_STORAGE,
        useClass: CloudinaryImageStorage,
    },
])
export class ImageStorageModule {}
