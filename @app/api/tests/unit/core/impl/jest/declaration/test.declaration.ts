import { SuitDeclaration } from '@mono/test-utils'
import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    test,
} from '@jest/globals'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { objectValues } from '@mono/object-utils'
import { join } from 'node:path'
import { globSync } from 'glob'

const importHook = async (e: string) => {
    const module = await import('file:///' + e)
    return objectValues(module)[0]
}

export const jestSuitDeclartion: SuitDeclaration = (
    name: string,
    data = {},
) => {
    const callStack = getCallStack()
    const filePath = callStack[1]
        .replaceAll('\\', '/')
        .split('/')
        .toSpliced(-1)
        .join('/')
    const paths: string[] = globSync(
        join(filePath, './tests/*.test.js').replace(/\\/g, '/'),
    )
    const pathsBeforeEach: string[] = globSync(
        join(filePath, './*.beforeEach.js').replace(/\\/g, '/'),
    )
    const pathsBeforeAll: string[] = globSync(
        join(filePath, './*.beforeAll.js').replace(/\\/g, '/'),
    )
    const pathsAfterEach: string[] = globSync(
        join(filePath, './*.afterEach.js').replace(/\\/g, '/'),
    )
    const pathsAfterAll: string[] = globSync(
        join(filePath, './*.afterAll.js').replace(/\\/g, '/'),
    )
    describe(name, async () => {
        ;[
            ...(data.afterAll || []),
            ...(await pathsAfterAll.asyncMap(importHook)),
        ].map((after) => afterAll(after))
        ;[
            ...(data.beforeAll || []),
            ...(await pathsBeforeAll.asyncMap(importHook)),
        ].map((before) => beforeAll(before))
        ;[
            ...(data.afterEach || []),
            ...(await pathsAfterEach.asyncMap(importHook)),
        ].map((after) => afterEach(after))
        ;[
            ...(data.beforeEach || []),
            ...(await pathsBeforeEach.asyncMap(importHook)),
        ].map((before) => beforeEach(before))
        await [
            ...(data.tests || []),
            ...(await paths.asyncMap(async (e) => {
                const module = await import('file:///' + e)
                if (!module.name || !module.body)
                    throw new Error('Invalid test case from path: ' + e)
                return module
            })),
        ].asyncMap(async (e) => {
            if (e.options?.skip) return test.skip(e.name, e.body)
            if (e.options?.only) return test.only(e.name, e.body)
            return test(e.name, e.body)
        })
    })
}
