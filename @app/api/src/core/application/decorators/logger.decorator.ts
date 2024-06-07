import { isNotNull } from 'src/utils/null-manager/null-checker'
import { LoggerContract } from '../logger/logger.contract'
import { Result } from '../result-handler/result.handler'
import { ApplicationService } from '../service/application.service'

export class LoggerDecorator<T, R> implements ApplicationService<T, R> {
    constructor(
        private service: ApplicationService<T, R>,
        private logger: LoggerContract,
    ) {}
    async execute(data: T): Promise<Result<R>> {
        try {
            this.logger.log('INPUT:', JSON.stringify(data))
            const result = await this.service.execute(data)
            if (result.isError())
                this.logger.error(JSON.stringify(result.handleError((e) => e)))
            if (isNotNull(result.unwrap()))
                this.logger.log('RESULT:', JSON.stringify(result.unwrap()))
            return result
        } catch (error) {
            this.logger.exception(JSON.stringify(error))
            throw error
        }
    }
}
