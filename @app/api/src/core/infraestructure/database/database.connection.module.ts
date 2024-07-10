import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigurationModule } from '../decorators/config.module.decorator'
import 'dotenv/config'
import { MongooseModule } from '@nestjs/mongoose'

@ConfigurationModule([
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE_NAME,
        autoLoadEntities: true,
        synchronize: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL ?? ''),
])
export class DatabaseConnectionModule {}
