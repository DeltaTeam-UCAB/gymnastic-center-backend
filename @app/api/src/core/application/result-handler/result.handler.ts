import { ApplicationError } from '../error/application.error'
import { ResultHandler } from './types/result.callbacks'

export class Result<T> {
    private constructor(private value?: T, private error?: ApplicationError) {
        if (value !== undefined && error !== undefined)
            throw new Error('Value and error not to be definined same time')
    }

    unwrap(): T {
        if (this.error) throw this.error
        return this.value!
    }

    isError() {
        return Boolean(this.error)
    }

    handleError<R>(handler: (e: ApplicationError<any>) => R) {
        if (!this.isError()) throw new Error('Can not handler without an error')
        return handler(this.error!)
    }

    unwrapOr(defaultValue: T): T {
        if (this.value === undefined) return defaultValue
        return this.value
    }

    match<R, RE>(handler: ResultHandler<T, R, RE>) {
        if (!this.error) return handler.success(this.value!)
        return handler.error(this.error)
    }

    convertToOther<T>() {
        if (!this.isError())
            throw new Error('Can not convert to other without an error')
        return Result.error<T>(this.error!)
    }

    static success<T>(value: T) {
        return new Result(value, undefined)
    }

    static error<T>(error: ApplicationError) {
        return new Result<T>(undefined, error)
    }
}
