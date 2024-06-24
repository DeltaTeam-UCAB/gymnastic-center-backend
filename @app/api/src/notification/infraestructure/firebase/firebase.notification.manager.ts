import {
    NotificationManager,
    NotificationManagerInput,
} from 'src/notification/application/services/notification.manager'
import { getTokens } from './token.storage'
import { firebaseInitialized } from './firebase.configuration'

export class FirebaseNotificationManager implements NotificationManager {
    async notify(data: NotificationManagerInput): Promise<void> {
        const tokens = getTokens(data.to)
        await tokens.asyncForEach(async (token) => {
            await firebaseInitialized.messaging().send({
                token,
                notification: {
                    title: data.title,
                    body: data.body,
                },
            })
        })
    }
}
