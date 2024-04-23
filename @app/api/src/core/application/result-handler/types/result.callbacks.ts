import { ApplicationError } from '../../error/application.error'

export type ResultHandler<T, R, RE> = {
    success(value: T): R
    error(error: ApplicationError): RE
}
