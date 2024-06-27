import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Notification } from 'src/notification/application/models/notification'
import {
    NotificationManyData,
    NotificationRepository,
} from 'src/notification/application/repositories/notification.repository'
import { Notification as NotificationORM } from '../../models/postgres/notification.entity'
import { Repository } from 'typeorm'

export class NotificationPostgresRepository implements NotificationRepository {
    constructor(
        @InjectRepository(NotificationORM)
        private notificationProvider: Repository<NotificationORM>,
    ) {}
    async save(notification: Notification): Promise<Result<Notification>> {
        await this.notificationProvider.upsert(
            this.notificationProvider.create(notification),
            ['id'],
        )
        return Result.success(notification)
    }

    getById(id: string): Promise<Optional<Notification>> {
        return this.notificationProvider.findOneBy({
            id,
        })
    }

    getMany(data: NotificationManyData): Promise<Notification[]> {
        return this.notificationProvider.find({
            take: data.perPage,
            skip: data.perPage * (data.page - 1),
            where: {
                client: data.client,
            },
            order: {
                date: -1,
            },
        })
    }

    countNotReaded(clientId: string): Promise<number> {
        return this.notificationProvider.count({
            where: {
                client: clientId,
            },
        })
    }

    async deleteByUser(client: string): Promise<Result<void>> {
        await this.notificationProvider.delete({
            client,
        })
        return Result.success(undefined)
    }
}
