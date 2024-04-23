import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { jsonToString } from '@mono/object-utils'

export const OnPublish = createParamDecorator(
    (_: unknown, context: ExecutionContext) => {
        const response = context.switchToHttp().getResponse()
        return (data: object) => {
            const text = jsonToString(data)
            response.write(text)
        }
    },
)
