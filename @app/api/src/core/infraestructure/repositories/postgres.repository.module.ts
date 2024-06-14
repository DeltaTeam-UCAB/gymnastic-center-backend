import { initializeModels } from './loaders/model.loader'
import { initializeRepositories } from './loaders/repositories.loader'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServiceModule } from '../decorators/service.module'
import { PostgresTransactionProvider } from './transaction/postgres.transaction'

const repositories = await initializeRepositories('postgres')

@ServiceModule(
    [...repositories, PostgresTransactionProvider],
    [TypeOrmModule.forFeature(await initializeModels('entity', 'postgres'))],
)
export class PostgresRepositoryModule {}
