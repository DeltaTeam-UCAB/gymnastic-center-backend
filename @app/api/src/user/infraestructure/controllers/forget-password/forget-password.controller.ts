import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ForgetPasswordDTO } from './dto/dto'
import { Body, Post } from '@nestjs/common'
import { RecoveryPasswordSenderDecorator } from 'src/user/application/commads/recovery-password/decorators/sender.decorator'
import { RecoveryPasswordCommand } from 'src/user/application/commads/recovery-password/recovery.password.command'
import { UserPostgresRepository } from '../../repositories/postgres/user.repository'
import { CryptoRandomCodeGenerator } from 'src/core/infraestructure/random-code/random-code.crypto.generator'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { RecoveryCodeEmailSender } from '../../sender/recovery.code.sender'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
})
export class ForgetPasswordController
    implements
        ControllerContract<
            [body: ForgetPasswordDTO],
            {
                date: Date
            }
        >
{
    constructor(private userRepository: UserPostgresRepository) {}
    @Post('forget/password')
    async execute(@Body() body: ForgetPasswordDTO): Promise<{
        date: Date
    }> {
        await new RecoveryPasswordSenderDecorator(
            new LoggerDecorator(
                new RecoveryPasswordCommand(
                    this.userRepository,
                    new CryptoRandomCodeGenerator(),
                    new ConcreteDateProvider(),
                ),
                new NestLogger('ForgetPassword'),
            ),
            this.userRepository,
            new RecoveryCodeEmailSender(),
        ).execute(body)
        return {
            date: new Date(),
        }
    }
}
