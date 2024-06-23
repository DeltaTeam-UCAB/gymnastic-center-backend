import { Result } from 'src/core/application/result-handler/result.handler'
import { Notification } from '../models/notification'
import { Optional } from '@mono/types-utils'

export type NotificationManyData = {
    page: number
    perPage: number
    client: string
}

export interface NotificationRepository {
    save(notification: Notification): Promise<Result<Notification>>
    getById(id: string): Promise<Optional<Notification>>
    getMany(data: NotificationManyData): Promise<Notification[]>
    countNotReaded(clientId: string): Promise<number>
    deleteByUser(client: string): Promise<Result<void>>
}
