import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { TRAINER_DELETED, trainerDeleted } from './event/trainer.deleted'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { TrainerID } from './event/value-objects/trainer.id'
import { DeleteCoursesByTrainerCommand } from 'src/course/application/commands/delete-by-trainer/delete-by-trainer.course.command'
import { CoursePostgresRepository } from '../../repositories/postgres/course.repository'

@Injectable()
export class TrainerDeletedCourseEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private courseRepository: CoursePostgresRepository,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            TRAINER_DELETED,
            TRAINER_DELETED + '_DELETE_COURSES',
            (json) =>
                trainerDeleted({
                    id: new TrainerID(json.id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DeleteCoursesByTrainerCommand(
                        this.courseRepository,
                        this.eventHandler,
                    ),
                    new NestLogger('Delete All Courses By Trainer'),
                ).execute({
                    id: event.id.id,
                })
            },
        )
    }
}
