import { ConfigModule } from '@nestjs/config'
import { ConfigurationModule } from '../decorators/config.module.decorator'
import { join } from 'path'

console.log('env variables')
@ConfigurationModule([
    ConfigModule.forRoot({
        envFilePath: join(process.cwd(), './.env'),
    }),
])
export class EnvModule {}
