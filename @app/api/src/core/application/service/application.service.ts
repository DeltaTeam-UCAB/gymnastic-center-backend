import { Result } from '../result-handler/result.handler'

export interface ApplicationService<T, U> {
    execute(data: T): Promise<Result<U>>
}
