import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export type CloseHandler = (callback: () => void) => void

export const OnClose = createParamDecorator(
    (_: unknown, context: ExecutionContext): CloseHandler => {
        const response = context.switchToHttp().getResponse()
        return (callback: () => void) => response.on('close', () => callback())
    },
)
