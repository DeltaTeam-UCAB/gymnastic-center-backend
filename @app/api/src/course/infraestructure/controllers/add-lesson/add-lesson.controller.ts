import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { COURSE_DOC_PREFIX, COURSE_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { AddLessonDTO } from './dto/dto'
import { AddLessonResponse } from 'src/course/application/commands/add-lesson/types/response'
import { Body, HttpException, Inject, Put, UseGuards } from '@nestjs/common'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { VideoPostgresByCourseRepository } from '../../repositories/postgres/video.repository'
import { PostgresTransactionProvider } from 'src/core/infraestructure/repositories/transaction/postgres.transaction'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CoursePostgresTransactionalRepository } from '../../repositories/postgres/course.repository.transactional'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { AddLessonCommand } from 'src/course/application/commands/add-lesson/add.lesson.command'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { TransactionHandlerDecorator } from 'src/core/application/decorators/transaction.handler.decorator'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'

@Controller({
    path: COURSE_ROUTE_PREFIX,
    docTitle: COURSE_DOC_PREFIX,
    bearerAuth: true,
})
export class AddLessonController
    implements ControllerContract<[data: AddLessonDTO], AddLessonResponse>
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private videoRepository: VideoPostgresByCourseRepository,
        private transactionProvider: PostgresTransactionProvider,
        private eventPublisher: RabbitMQEventHandler,
    ) {}

    @Put('add/lesson')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(@Body() body: AddLessonDTO): Promise<AddLessonResponse> {
        const manager = await this.transactionProvider.create()
        const courseRepository = new CoursePostgresTransactionalRepository(
            manager.queryRunner,
        )
        const nestLogger = new NestLogger('Add lesson logger')

        const result = await new ErrorDecorator(
            new TransactionHandlerDecorator(
                new LoggerDecorator(
                    new DomainErrorParserDecorator(
                        new AddLessonCommand(
                            this.idGen,
                            courseRepository,
                            this.videoRepository,
                            this.eventPublisher,
                        ),
                    ),
                    nestLogger,
                ),
                manager.transactionHandler,
            ),
            (e) => {
                return new HttpException(e.message, 404)
            },
        ).execute(body)
        return result.unwrap()
    }
}
