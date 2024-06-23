import { createNotification } from './utils/notification.factory'
import { NotificationRepositoryMock } from './utils/notification.repository.mock'
import { MarkNotificationAsReadedCommand } from '../../../../../src/notification/application/commands/mark-readed/mark.notification.readed.command'
import { NOTIFICATION_NOT_FOUND } from '../../../../../src/notification/application/errors/notification.not.found'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { MarkNotificationAsReadedResponse } from '../../../../../src/notification/application/commands/mark-readed/types/response'

export const name =
    'Should not mark notification as readed without a valid client'
export const body = async () => {
    const notification = createNotification()
    const notificationRepository = new NotificationRepositoryMock([
        notification,
    ])
    const result: Result<MarkNotificationAsReadedResponse> =
        await new MarkNotificationAsReadedCommand(
            notificationRepository,
        ).execute({
            id: notification.id,
            client: '12345',
        })
    lookFor(
        result.handleError((e) => {
            lookFor(e.name).equals(NOTIFICATION_NOT_FOUND)
        }),
    )
}
