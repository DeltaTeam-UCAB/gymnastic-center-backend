import { ApplicationService } from '../service/application.service'
import { Result } from '../result-handler/result.handler'
import { makeApplicationErrorFactory } from '../error/application.error'

export class DomainErrorParserDecorator<T, U>
    implements ApplicationService<T, U>
{
    constructor(private service: ApplicationService<T, U>) {}
    async execute(data: T): Promise<Result<U>> {
        try {
            return await this.service.execute(data)
        } catch (error) {
            if (error.kind === 'DOMAIN')
                return Result.error(
                    makeApplicationErrorFactory({
                        name: error.name,
                        message: error.message,
                    })(error.info),
                )
            throw error
        }
    }
}
