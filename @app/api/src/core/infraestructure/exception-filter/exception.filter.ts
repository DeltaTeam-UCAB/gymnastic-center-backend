import {
    Catch,
    ArgumentsHost,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        if (exception instanceof HttpException) super.catch(exception, host)
        super.catch(new InternalServerErrorException(), host)
    }
}
