import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Lesson } from 'src/course/application/models/lesson'
import { LessonRepository } from 'src/course/application/repositories/lesson.repository'
import { Lesson as UserORM } from '../../models/postgres/lesson.entity'
import { Repository } from 'typeorm'

@Injectable()
export class LessonPostgresRepository implements LessonRepository {
    constructor(
        @InjectRepository(UserORM) private lessonProvider: Repository<UserORM>,
    ) {}

    async save(lesson: Lesson): Promise<Result<Lesson>> {
        await this.lessonProvider.upsert(this.lessonProvider.create(lesson), [
            'id',
        ])
        return Result.success(lesson)
    }

    async erase(lesson: Lesson): Promise<Result<Lesson>> {
        await this.lessonProvider.delete(lesson.id)
        return Result.success(lesson)
    }

    async getById(id: string): Promise<Optional<Lesson>> {
        const lesson = await this.lessonProvider.findOneBy({
            id,
        })
        return lesson
    }

    existByName(name: string): Promise<boolean> {
        return this.lessonProvider.existsBy({
            name,
        })
    }
}
