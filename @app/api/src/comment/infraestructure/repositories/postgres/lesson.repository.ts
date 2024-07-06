import { InjectRepository } from '@nestjs/typeorm'
import { LessonRepository } from 'src/comment/application/repositories/lesson.repository'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'
import { Lesson } from 'src/comment/infraestructure/models/postgres/lesson.entity'
import { Repository } from 'typeorm'

export class LessonPostgresByCommentRepository implements LessonRepository {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    ) {}

    async existsById(id: LessonID): Promise<boolean> {
        const exists = await this.lessonRepository.existsBy({
            id: id.id,
            active: true,
        })
        return exists
    }
}
