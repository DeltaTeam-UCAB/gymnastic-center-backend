import { createNotification } from './utils/notification.factory'
import { NotificationRepositoryMock } from './utils/notification.repository.mock'
import { GetNotificationByIdQuery } from '../../../../../src/notification/application/queries/get-id/get.notification.id.query'

export const name = 'Should get notification by id'
export const body = async () => {
    const notification = createNotification()
    const notificationRepository = new NotificationRepositoryMock([
        notification,
    ])
    const result = await new GetNotificationByIdQuery(
        notificationRepository,
    ).execute({
        id: notification.id,
    })
    lookFor(result.unwrap()).toDeepEqual({
        id: notification.id,
        title: notification.title,
        body: notification.body,
        date: notification.date,
    })
}
