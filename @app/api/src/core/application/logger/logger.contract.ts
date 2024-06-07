export interface LoggerContract {
    log(...data: string[]): void
    error(...data: string[]): void
    exception(...data: string[]): void
}
