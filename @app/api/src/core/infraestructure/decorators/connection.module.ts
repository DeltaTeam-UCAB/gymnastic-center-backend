import { TypeClass } from '@mono/types-utils'
import { DynamicModule, ForwardReference, Global, Module } from '@nestjs/common'

export function ConfigurationModule(
    dependencies: (
        | TypeClass<object>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference
    )[],
) {
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isConnectionModule = true
        return Module({
            imports: dependencies,
        })(Global()(target) as T)
    }
}
