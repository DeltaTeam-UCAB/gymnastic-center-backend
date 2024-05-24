import { createNotification } from './utils/notification.factory'
import { NotificationRepositoryMock } from './utils/notification.repository.mock'
import { MarkNotificationAsReadedCommand } from '../../../../../src/notification/application/commands/mark-readed/mark.notification.readed.command'

export const name = 'Should mark notification as readed'
export const body = async () => {
    const notification = createNotification()
    const notificationRepository = new NotificationRepositoryMock([
        notification,
    ])
    const result = await new MarkNotificationAsReadedCommand(
        notificationRepository,
    ).execute({
        id: notification.id,
        client: notification.client,
    })
    lookFor(result.isError()).equals(false)
    lookFor(await notificationRepository.getById(notification.id)).toDeepEqual({
        ...notification,
        readed: true,
    })
}
