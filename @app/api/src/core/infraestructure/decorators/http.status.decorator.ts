import { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export type SetStatus = (status: string | number) => void

export const Status = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        const response = context.switchToHttp().getResponse()
        return (status: string | number): void => response.status(status)
    },
)
