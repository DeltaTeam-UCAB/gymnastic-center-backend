import { Result } from '../result-handler/result.handler'

export interface TokenProvider<T extends object> {
    sign(value: T): Result<string>
    verify(value: string): Result<T>
}
