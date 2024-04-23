import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const EmitEvent = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        const client = context.switchToWs().getClient()
        return (data: unknown, event: string, ...to: string[]) =>
            client.to(to).emit(event, data)
    },
)
