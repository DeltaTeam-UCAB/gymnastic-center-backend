import { Result } from 'src/core/application/result-handler/result.handler'
import { User } from '../models/user'

export interface UserSender {
    sendToUser(user: User): Promise<Result<boolean>>
}
