import {
    DynamicModule,
    ForwardReference,
    Module,
    Provider,
} from '@nestjs/common'
import { TypeClass } from '@mono/types-utils'

export function ServiceModule(
    services: Provider[],
    dependencies?: (
        | TypeClass<object>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference
    )[],
) {
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isServiceModule = true
        return Module({
            imports: dependencies,
            providers: services,
            exports: services,
        })(target)
    }
}
