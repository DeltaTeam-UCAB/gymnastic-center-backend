import { InjectRepository } from '@nestjs/typeorm'
import { LessonRepository } from 'src/comment/application/repositories/lesson.repository'
import { Lesson } from 'src/comment/infraestructure/models/postgres/lesson.entity'
import { Repository } from 'typeorm'

export class LessonPostgresRepository implements LessonRepository {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    ) {}

    async existsById(id: string): Promise<boolean> {
        const exists = await this.lessonRepository.existsBy({
            id,
        })
        return exists
    }
}
