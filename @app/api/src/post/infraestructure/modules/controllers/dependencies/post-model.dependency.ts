import { TypeOrmModule } from '@nestjs/typeorm'
import { Posts } from '../../../models/postgres/post.entity'
import { PostImages } from 'src/post/infraestructure/models/postgres/post-images.entity'

export const PostModel = TypeOrmModule.forFeature([Posts, PostImages])
