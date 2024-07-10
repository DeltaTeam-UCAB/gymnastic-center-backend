import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const NOTIFICATION_NOT_FOUND = 'NOTIFICATION_NOT_FOUND'

export const notificationNotFoundError = makeApplicationErrorFactory({
    name: NOTIFICATION_NOT_FOUND,
    message: 'Notification not found',
})
