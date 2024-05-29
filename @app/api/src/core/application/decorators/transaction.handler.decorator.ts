import { Result } from '../result-handler/result.handler'
import { ApplicationService } from '../service/application.service'
import { TransactionHandler } from '../transaction/transaction.handler'

export class TransactionHandlerDecorator<T, U>
    implements ApplicationService<T, U>
{
    constructor(
        private service: ApplicationService<T, U>,
        private transactionHandler: TransactionHandler,
    ) {}
    async execute(data: T): Promise<Result<U>> {
        try {
            const result = await this.service.execute(data)
            if (result.isError()) {
                await this.transactionHandler.cancel()
            } else {
                await this.transactionHandler.commit()
            }
            return result
        } catch (e) {
            await this.transactionHandler.cancel()
            throw e
        }
    }
}
