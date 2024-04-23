import { globSync } from 'glob'
import { join } from 'node:path'
import { objectValues } from '@mono/object-utils'
import { TypeClass } from '@mono/types-utils'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { DynamicModule, ForwardReference, Module } from '@nestjs/common'
import { loadDependencies } from '../../controllers/decorators/controller.module'

const initializeEventListeners = (currentPath: string) => {
    const data = globSync(
        join(
            currentPath,
            '../../event-listeners/**/*.event.listener.js',
        ).replace(/\\/g, '/'),
    )
    return data.asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}

export async function EventListenersModule(
    dependencies: (
        | TypeClass<object>
        | DynamicModule
        | Promise<DynamicModule>
        | ForwardReference
    )[] = [],
) {
    if (
        !dependencies?.every(
            (e: any) => e.__isBarrelModule || e.__isServiceModule,
        )
    )
        throw new Error('Invalid submodules for EventListenersModule')
    const callStack = getCallStack()
    const filePath = callStack[1]
        .replaceAll('\\', '/')
        .split('/')
        .toSpliced(-1)
        .join('/')
    dependencies.push(...(await loadDependencies(filePath)))
    const listeners = await initializeEventListeners(filePath)
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isEventListenerModule = true
        return Module({
            providers: listeners,
            imports: dependencies,
        })(target)
    }
}
