import {
    NotificationManager,
    NotificationManagerInput,
} from 'src/notification/application/services/notification.manager'
import { firebaseInitialized } from 'src/core/infraestructure/firebase/app.init'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

export class FirebaseNotificationManager implements NotificationManager {
    async notify(data: NotificationManagerInput): Promise<void> {
        const tokens = await redisClient.sMembers(
            'notification-token:' + data.to,
        )
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
