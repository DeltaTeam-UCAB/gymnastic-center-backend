import { Logger } from '@nestjs/common'
import { LoggerContract } from 'src/core/application/logger/logger.contract'

export class NestLogger implements LoggerContract {
    constructor(title: string, private readonly logger = new Logger(title)) {}
    log(...data: string[]): void {
        this.logger.log(data.join(' '))
    }
    exception(...data: string[]): void {
        this.logger.error('EXCEPTION: ' + data.join(' '))
    }
    error(...data: string[]): void {
        this.logger.error('ERROR: ' + data.join(' '))
    }
}
