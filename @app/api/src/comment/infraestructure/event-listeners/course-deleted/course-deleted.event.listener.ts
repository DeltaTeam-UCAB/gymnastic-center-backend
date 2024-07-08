import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { COURSE_DELETED, courseDeleted } from './event/course.deleted'
import { CourseID } from './event/value-objects/course.id'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { CoursePostgreByCommentRepositry } from '../../repositories/postgres/course.repository'
import { DeleteCourseCommentsPolicy } from 'src/comment/application/policies/delete-course-comments/delete.course.comments.policy'
import { DeleteCommentsByTargetCommand } from 'src/comment/application/commands/delete-by-target/delete.by.target'

@Injectable()
export class CourseDeletedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private commentRepository: CommentPostgresRepository,
        private courseRepository: CoursePostgreByCommentRepositry,
    ) {
        this.load()
    }
    load() {
        this.eventHandler.listen(
            COURSE_DELETED,
            COURSE_DELETED + '_DELETE_COMMENTS',
            (json) =>
                courseDeleted({
                    id: new CourseID(json.id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new DeleteCourseCommentsPolicy(
                    new LoggerDecorator(
                        new DeleteCommentsByTargetCommand(
                            this.commentRepository,
                            this.eventHandler,
                        ),
                        new NestLogger('Delete course by target'),
                    ),
                    this.courseRepository,
                ).execute({
                    courseId: event.id.id,
                })
            },
        )
    }
}
