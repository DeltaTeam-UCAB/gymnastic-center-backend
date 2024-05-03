import { TypeOrmModule } from '@nestjs/typeorm'
import { Comment } from 'src/comment/infraestructure/models/postgres/comment.entity'

export const CommentModel = TypeOrmModule.forFeature([Comment])
