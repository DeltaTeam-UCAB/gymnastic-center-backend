import { SuitDeclaration } from '@mono/test-utils'
import { globSync } from 'glob'
import { join } from 'node:path'
import { test } from 'node:test'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { objectValues } from '@mono/object-utils'

const importHook = async (e: string) => {
    const module = await import('file:///' + e)
    return objectValues(module)[0]
}

export const nodeTestSuitDeclartion: SuitDeclaration = (
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
    test(
        name,
        {
            ...data.options,
        },
        async (t) => {
            ;[
                ...(data.afterAll || []),
                ...(await pathsAfterAll.asyncMap(importHook)),
            ].map((after) => t.after(after))
            ;[
                ...(data.beforeAll || []),
                ...(await pathsBeforeAll.asyncMap(importHook)),
            ].map((before) => t.before(before))
            ;[
                ...(data.afterEach || []),
                ...(await pathsAfterEach.asyncMap(importHook)),
            ].map((after) => t.afterEach(after))
            ;[
                ...(data.beforeEach || []),
                ...(await pathsBeforeEach.asyncMap(importHook)),
            ].map((before) => t.beforeEach(before))
            await [
                ...(data.tests || []),
                ...(await paths.asyncMap(async (e) => {
                    const module = await import('file:///' + e)
                    if (!module.name || !module.body)
                        throw new Error('Invalid test case from path: ' + e)
                    return module
                })),
            ].asyncMap((e) => {
                return t.test(
                    e.name,
                    {
                        ...e.options,
                    },
                    e.body,
                )
            })
        },
    )
}
