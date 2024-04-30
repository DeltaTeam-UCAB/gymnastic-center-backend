import { TypeOrmModule } from '@nestjs/typeorm'
import { Client } from 'src/client/infraestructure/models/postgres/client.entity'

export const ClientModel = TypeOrmModule.forFeature([Client])