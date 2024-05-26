import { createNotification } from './utils/notification.factory'
import { NotificationRepositoryMock } from './utils/notification.repository.mock'
import { GetCountNotificationsNotReadedQuery } from '../../../../../src/notification/application/queries/not-readed/notifications.not.readed.query'

export const name = 'Should count notifications not readed by client'
export const body = async () => {
    const notification1 = createNotification()
    const notification2 = createNotification({
        id: '1234',
        readed: true,
    })
    const notification3 = createNotification({
        id: '12345',
    })
    const notification4 = createNotification({
        id: '12345',
        readed: true,
    })
    const notificationRepository = new NotificationRepositoryMock([
        notification1,
        notification3,
        notification4,
        notification2,
    ])
    const result = await new GetCountNotificationsNotReadedQuery(
        notificationRepository,
    ).execute({
        client: notification1.client,
    })
    lookFor(result.unwrap()).toDeepEqual({
        count: 2,
    })
}
