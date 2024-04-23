import { ApplicationService } from '../service/application.service'
import { ExceptionReductor } from '../exception-reductor/exception.reductor'
import { Result } from '../result-handler/result.handler'

export class ExceptionDecorator<T, U> implements ApplicationService<T, U> {
    constructor(
        private service: ApplicationService<T, U>,
        private reductor: ExceptionReductor,
    ) {}
    async execute(data: T): Promise<Result<U>> {
        try {
            return this.service.execute(data)
        } catch (e) {
            this.reductor.reduce(e)
            throw e
        }
    }
}
