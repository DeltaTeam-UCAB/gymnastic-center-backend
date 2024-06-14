import { InjectRepository } from '@nestjs/typeorm'
import { BlogRepository } from 'src/comment/application/repositories/blog.repository'
import { Blog } from 'src/comment/infraestructure/models/postgres/blog.entity'
import { Repository } from 'typeorm'

export class BlogPostgresByCommentRepository implements BlogRepository {
    constructor(
        @InjectRepository(Blog) private postRepository: Repository<Blog>,
    ) {}

    async existsById(id: string): Promise<boolean> {
        const exists = await this.postRepository.existsBy({
            id,
        })
        return exists
    }
}
