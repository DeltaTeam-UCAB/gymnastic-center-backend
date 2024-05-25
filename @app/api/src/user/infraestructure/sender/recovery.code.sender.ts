import { Result } from 'src/core/application/result-handler/result.handler'
import { User } from 'src/user/application/models/user'
import { UserSender } from 'src/user/application/services/sender'
import { createTransport } from 'nodemailer'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const transporter = createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.SENDER_PASSWORD,
    },
})

export class RecoveryCodeEmailSender implements UserSender {
    async sendToUser(user: User): Promise<Result<boolean>> {
        const template = readFileSync(
            join(process.cwd(), './public/templates/recovery-code.html'),
            {
                encoding: 'utf8',
            },
        )
        const templateWithName = template.replace('{{name}}', user.name)
        const templateWithCode = templateWithName.replace(
            '{{code}}',
            String(user.code),
        )
        await transporter
            .sendMail({
                from: process.env.EMAIL_SENDER,
                to: user.email,
                subject: 'Recovery code',
                html: templateWithCode,
            })
            .catch(console.log)
        return Result.success(true)
    }
}
