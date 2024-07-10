import { InjectRepository } from '@nestjs/typeorm'
import { BlogRepository } from 'src/comment/application/repositories/blog.repository'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'
import { Blog } from 'src/comment/infraestructure/models/postgres/blog.entity'
import { Repository } from 'typeorm'

export class BlogPostgresByCommentRepository implements BlogRepository {
    constructor(
        @InjectRepository(Blog) private postRepository: Repository<Blog>,
    ) {}

    async existsById(id: BlogID): Promise<boolean> {
        const exists = await this.postRepository.existsBy({
            id: id.id,
            active: true,
        })
        return exists
    }
}
