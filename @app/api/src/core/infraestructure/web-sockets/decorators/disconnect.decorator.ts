import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const Disconnect = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        const client = context.switchToWs().getClient()
        return () => client.disconnect()
    },
)
