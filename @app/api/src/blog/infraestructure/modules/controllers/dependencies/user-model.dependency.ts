import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/infraestructure/models/postgres/user.entity'

export const UserModel = TypeOrmModule.forFeature([User])
