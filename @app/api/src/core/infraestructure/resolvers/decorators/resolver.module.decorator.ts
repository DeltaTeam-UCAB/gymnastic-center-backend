import { globSync } from 'glob'
import { join } from 'node:path'
import { objectValues } from '@mono/object-utils'
import { TypeClass } from '@mono/types-utils'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { DynamicModule, ForwardReference, Module } from '@nestjs/common'

export const initializeResolvers = (currentPath: string) => {
    const data = globSync(
        join(currentPath, '../../resolvers/**/*.resolver.js').replace(
            /\\/g,
            '/',
        ),
    )
    return data.asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}

const initializeServices = (currentPath: string) => {
    const data = globSync(
        join(currentPath, '../../services/**/*.service.js').replace(/\\/g, '/'),
    )
    return data.asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}

export const loadDependencies = (currentPath: string) => {
    const data = globSync(
        join(currentPath, './dependencies/*.dependency.js').replace(/\\/g, '/'),
    )
    return data.asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}

export async function ResolversModule(
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
        throw new Error('Invalid submodules for ResolversModule')
    const callStack = getCallStack()
    const filePath = callStack[1]
        .replaceAll('\\', '/')
        .split('/')
        .toSpliced(-1)
        .join('/')
    dependencies.push(...(await loadDependencies(filePath)))
    const services = await initializeServices(filePath)
    const resolvers = await initializeResolvers(filePath)
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isResolverModule = true
        return Module({
            providers: [...resolvers, ...services],
            imports: dependencies,
        })(target)
    }
}
