import { Injectable } from '@nestjs/common'
import { TransactionHandler } from 'src/core/application/transaction/transaction.handler'
import { DataSource } from 'typeorm'

@Injectable()
export class PostgresTransactionProvider {
    constructor(private dataSource: DataSource) {}
    async create() {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        return {
            transactionHandler: {
                async commit() {
                    await queryRunner.commitTransaction()
                    await queryRunner.release()
                },
                async cancel() {
                    await queryRunner.rollbackTransaction()
                    await queryRunner.release()
                },
            } as TransactionHandler,
            queryRunner,
        }
    }
}
