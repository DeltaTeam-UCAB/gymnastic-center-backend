import { Result } from 'src/core/application/result-handler/result.handler'
import { firebaseInitialized } from 'src/core/infraestructure/firebase/app.init'
import { User } from 'src/user/application/models/user'
import { UserSender } from 'src/user/application/services/sender'
export class RecoveryCodePushSender implements UserSender {
    constructor(private readonly token: string) {}
    async sendToUser(user: User): Promise<Result<boolean>> {
        await firebaseInitialized.messaging().send({
            token: this.token,
            notification: {
                body: 'Your code is: ' + user.code,
                title: 'Recovery code',
            },
        })
        return Result.success(true)
    }
}
