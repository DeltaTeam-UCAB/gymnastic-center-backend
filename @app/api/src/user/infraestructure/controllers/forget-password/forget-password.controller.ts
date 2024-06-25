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
import { AuditDecorator } from 'src/core/application/decorators/audit.decorator'
import { AuditingTxtRepository } from 'src/core/infraestructure/auditing/repositories/txt/auditing.repository'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
})
export class ForgetPasswordController
    implements
        ControllerContract<
            [body: ForgetPasswordDTO, user: CurrentUserResponse],
            {
                date: Date
            }
        >
{
    constructor(private userRepository: UserPostgresRepository) {}
    @Post('forget/password')
    async execute(
        @Body() body: ForgetPasswordDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<{
        date: Date
    }> {
        const audit = {
            user: user.id,
            operation: 'Forget Password',
            succes: true,
            ocurredOn: new Date(Date.now()),
            data: JSON.stringify(body),
        }

        await new RecoveryPasswordSenderDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new RecoveryPasswordCommand(
                        this.userRepository,
                        new CryptoRandomCodeGenerator(),
                        new ConcreteDateProvider(),
                    ),
                    new NestLogger('ForgetPassword'),
                ),
                new AuditingTxtRepository(),
                audit,
            ),
            this.userRepository,
            new RecoveryCodeEmailSender(),
        ).execute(body)
        return {
            date: new Date(),
        }
    }
}
