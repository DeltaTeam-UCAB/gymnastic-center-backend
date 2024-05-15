import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from 'src/image/infraestructure/models/postgres/image.entity'

export const ImageModel = TypeOrmModule.forFeature([Image])
