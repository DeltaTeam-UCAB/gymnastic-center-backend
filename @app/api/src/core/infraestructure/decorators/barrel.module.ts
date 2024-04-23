import { TypeClass } from '@mono/types-utils'
import { DynamicModule, ForwardReference, Module } from '@nestjs/common'

export function BarrelModule(
    dependencies: (
        | TypeClass<object>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference
    )[],
) {
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isBarrelModule = true
        return Module({
            imports: dependencies,
            exports: dependencies,
        })(target)
    }
}
