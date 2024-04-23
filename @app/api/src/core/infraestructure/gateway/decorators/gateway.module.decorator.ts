import { globSync } from 'glob'
import { join } from 'node:path'
import { objectValues } from '@mono/object-utils'
import { TypeClass } from '@mono/types-utils'
import { DynamicModule, ForwardReference, Module } from '@nestjs/common'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'

const initializeGateways = (currentPath: string) => {
    const data = globSync(
        join(currentPath, '../../gateways/*.gateway.js').replace(/\\/g, '/'),
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

export async function GatewayModule(
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
        throw new Error('Invalid submodules for GatewayModule')
    const callStack = getCallStack()
    const filePath = callStack[1]
        .replaceAll('\\', '/')
        .split('/')
        .toSpliced(-1)
        .join('/')
    dependencies.push(...(await loadDependencies(filePath)))
    const services = await initializeServices(filePath)
    const gateways = await initializeGateways(filePath)
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isGatewayModule = true
        return Module({
            providers: [...gateways, ...services],
            imports: dependencies,
        })(target)
    }
}
