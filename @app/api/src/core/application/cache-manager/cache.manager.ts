import { Result } from '../result-handler/result.handler'

export interface CacheManager {
    get<T>(key: string): Promise<Result<T>>
    save<T>(key: string, data: T): Promise<Result<boolean>>
    delete(key: string): Promise<Result<boolean>>
}
