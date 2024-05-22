import { InjectRepository } from '@nestjs/typeorm'
import { PostRepository } from 'src/comment/application/repositories/post.repository'
import { Posts } from 'src/comment/infraestructure/models/postgres/post.entity'
import { Repository } from 'typeorm'

export class PostPostgresByCommentRepository implements PostRepository {
    constructor(
        @InjectRepository(Posts) private postRepository: Repository<Posts>,
    ) {}

    async existsById(id: string): Promise<boolean> {
        const exists = await this.postRepository.existsBy({
            id,
        })
        return exists
    }
}
