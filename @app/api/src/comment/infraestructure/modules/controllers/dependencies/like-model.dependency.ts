import { TypeOrmModule } from '@nestjs/typeorm'
import { Like } from 'src/comment/infraestructure/models/postgres/like.entity'

export const LikeModel = TypeOrmModule.forFeature([Like])
