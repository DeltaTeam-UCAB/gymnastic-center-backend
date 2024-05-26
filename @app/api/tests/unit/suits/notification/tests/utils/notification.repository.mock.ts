import { Optional } from '@mono/types-utils'
import { Notification } from '../../../../../../src/notification/application/models/notification'
import {
    NotificationManyData,
    NotificationRepository,
} from '../../../../../../src/notification/application/repositories/notification.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class NotificationRepositoryMock implements NotificationRepository {
    constructor(private notifications: Notification[] = []) {}
    async save(notification: Notification): Promise<Result<Notification>> {
        this.notifications = this.notifications.filter(
            (e) => e.id !== notification.id,
        )
        this.notifications.push(notification)
        return Result.success(notification)
    }

    async getById(id: string): Promise<Optional<Notification>> {
        return this.notifications.find((e) => e.id === id)
    }

    async getMany(data: NotificationManyData): Promise<Notification[]> {
        return this.notifications.filter((e) => e.client === data.client)
    }

    async countNotReaded(clientId: string): Promise<number> {
        return this.notifications.filter(
            (e) => e.client === clientId && !e.readed,
        ).length
    }
}
