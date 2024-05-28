import { TypeOrmModule } from '@nestjs/typeorm'
import { Posts } from '../../../models/postgres/post.entity'
import { PostImages } from '../../../models/postgres/post-images.entity'

export const BlogModel = TypeOrmModule.forFeature([Posts, PostImages])
