import { Result } from 'src/core/application/result-handler/result.handler'
import { DeviceLinker } from 'src/core/infraestructure/device-linker/device.linker'
import { firebaseInitialized } from 'src/core/infraestructure/firebase/app.init'
import { User } from 'src/user/application/models/user'
import { UserSender } from 'src/user/application/services/sender'
export class RecoveryCodePushSender implements UserSender {
    constructor(private deviceLinker: DeviceLinker) {}
    async sendToUser(user: User): Promise<Result<boolean>> {
        const token = await this.deviceLinker.getByUser(user.id)
        if (!token) return Result.success(true)
        await firebaseInitialized.messaging().send({
            token: token,
            notification: {
                body: 'Your code is: ' + user.code,
                title: 'Recovery code',
            },
        })
        return Result.success(true)
    }
}
