import { JwtModule } from '@nestjs/jwt'
import { JwtProviderService } from '../service/jwt.provider.service'
import { ServiceModule } from 'src/core/infraestructure/decorators/service.module'
import 'dotenv/config'

export const JWT_PROVIDER_TOKEN = 'JWT_PROVIDER_TOKEN'

@ServiceModule(
    [
        {
            provide: JWT_PROVIDER_TOKEN,
            useClass: JwtProviderService,
        },
    ],
    [
        JwtModule.register({
            secret: process.env.SECRET ?? 'test',
        }),
    ],
)
export class JwtProviderModule {}
