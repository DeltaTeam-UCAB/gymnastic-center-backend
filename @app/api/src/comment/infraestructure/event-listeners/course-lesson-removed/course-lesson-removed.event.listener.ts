import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CourseID } from './event/value-objects/course.id'
import { LessonID } from './event/value-objects/lesson.id'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import {
    COURSE_LESSON_REMOVED,
    courseLessonRemoved,
} from './event/course.lesson.removed'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { DeleteCommentsByTargetCommand } from 'src/comment/application/commands/delete-by-target/delete.by.target'

@Injectable()
export class CourseLessonRemovedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private commentRepository: CommentPostgresRepository,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            COURSE_LESSON_REMOVED,
            COURSE_LESSON_REMOVED + '_DELETE_COMMENTS',
            (json) =>
                courseLessonRemoved({
                    id: new CourseID(json.id._id),
                    lesson: new LessonID(json.lesson._id),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DomainErrorParserDecorator(
                        new DeleteCommentsByTargetCommand(
                            this.commentRepository,
                            this.eventHandler,
                        ),
                    ),
                    new NestLogger('Remove lesson comments'),
                ).execute({
                    type: 'LESSON',
                    targetId: event.lesson.id,
                })
            },
        )
    }
}
