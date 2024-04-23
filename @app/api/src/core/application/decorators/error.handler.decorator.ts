import { ApplicationError } from '../error/application.error'
import { ApplicationService } from '../service/application.service'
import { Result } from '../result-handler/result.handler'

export class ErrorDecorator<T, U> implements ApplicationService<T, U> {
    constructor(
        private service: ApplicationService<T, U>,
        private parser: (error: ApplicationError) => Error,
    ) {}
    async execute(data: T): Promise<Result<U>> {
        const result = await this.service.execute(data)
        if (result.isError()) throw result.handleError(this.parser)
        return result
    }
}
