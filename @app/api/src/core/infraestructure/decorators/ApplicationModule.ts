import { DynamicModule, ForwardReference, Module } from '@nestjs/common'
import { TypeClass } from '@mono/types-utils'

export function ApplicationModule(
    dependencies?: (
        | TypeClass<object>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference
    )[],
) {
    if (
        !dependencies?.every(
            (e: any) =>
                e.__isBarrelModule ||
                e.__isConfigModule ||
                e.__isConnectionModule,
        )
    )
        throw new Error('Invalid submodules for ApplicationModule')
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isAppModule = true
        return Module({
            imports: dependencies,
        })(target) as T
    }
}
