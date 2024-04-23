import {
    DynamicModule,
    ForwardReference,
    Module,
    Controller as NestController,
} from '@nestjs/common'
import { globSync } from 'glob'
import { join } from 'node:path'
import { objectValues } from '@mono/object-utils'
import { TypeClass } from '@mono/types-utils'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { ApiTags } from '@nestjs/swagger'

const initializeControllers = (currentPath: string) => {
    const data = globSync(
        join(currentPath, '../../controllers/**/*.controller.js').replace(
            /\\/g,
            '/',
        ),
    )
    return data.asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}

const initializeVersionedControllers = (
    currentPath: string,
    version: string,
) => {
    const data = globSync(
        join(
            currentPath,
            `../../controllers/${version}/**/*.controller.js`,
        ).replace(/\\/g, '/'),
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

export async function ControllerModule(
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
        throw new Error('Invalid submodules for ControllerModule')
    const callStack = getCallStack()
    const filePath = callStack[1]
        .replaceAll('\\', '/')
        .split('/')
        .toSpliced(-1)
        .join('/')
    const controllers = await initializeControllers(filePath)
    dependencies.push(...(await loadDependencies(filePath)))
    const services = await initializeServices(filePath)
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isControllerModule = true
        return Module({
            controllers,
            imports: dependencies,
            providers: services,
        })(target)
    }
}

export async function ControllerVersionedModule(
    version: string,
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
        throw new Error('Invalid submodules for ControllerModule')
    const callStack = getCallStack()
    const filePath = callStack[1]
        .replaceAll('\\', '/')
        .split('/')
        .toSpliced(-1)
        .join('/')
    const controllers = await initializeVersionedControllers(filePath, version)
    dependencies.push(...(await loadDependencies(filePath)))
    const services = await initializeServices(filePath)
    return function <T extends { new (...args: any[]): object }>(target: T) {
        ;(target as any).__isControllerModule = true
        return Module({
            controllers,
            imports: dependencies,
            providers: services,
        })(target)
    }
}

export function Controller(data?: { path: string; docTitle?: string }) {
    return function <T extends { new (...args: any[]): object }>(target: T) {
        if (
            Object.keys(target.prototype).find(
                (e) =>
                    typeof target.prototype[e] === 'function' &&
                    e !== 'execute',
            )
        )
            throw new Error('Invalid controller')
        return NestController(data?.path ?? '')(
            ApiTags(data?.docTitle ?? '')(target) as T,
        )
    }
}

export function ControllerVersioned(data?: {
    path: string
    docTitle?: string
    version?: string
}) {
    return function <T extends { new (...args: any[]): object }>(target: T) {
        if (
            Object.keys(target.prototype).find(
                (e) =>
                    typeof target.prototype[e] === 'function' &&
                    e !== 'execute',
            )
        )
            throw new Error('Invalid controller')
        const callStack = getCallStack()
        const filePath = callStack[1]
            .replaceAll('\\', '/')
            .split('/')
            .toSpliced(-1)
            .join('/')
        const version = data?.version ?? filePath.split('/').at(-2)
        return NestController(version + '/' + (data?.path ?? ''))(
            ApiTags(data?.docTitle ?? '')(target) as T,
        )
    }
}
