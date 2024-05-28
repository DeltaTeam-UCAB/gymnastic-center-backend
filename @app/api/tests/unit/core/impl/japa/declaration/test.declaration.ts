import { SuitDeclaration } from '@mono/test-utils'
import { globSync } from 'glob'
import { join } from 'node:path'
import { test } from '@japa/runner'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { objectValues } from '@mono/object-utils'

const importHook = async (e: string) => {
    const module = await import('file:///' + e)
    return objectValues(module)[0]
}

export const japaTestSuitDeclartion: SuitDeclaration = async (
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
    const tests = [
        ...(data.tests || []),
        ...(await paths.asyncMap(async (e) => {
            const module = await import('file:///' + e)
            if (!module.name || !module.body)
                throw new Error('Invalid test case from path: ' + e)
            return module
        })),
    ]
    const afterAlls = [
        ...(data.afterAll || []),
        ...(await pathsAfterAll.asyncMap(importHook)),
    ]
    const beforeAlls = [
        ...(data.beforeAll || []),
        ...(await pathsBeforeAll.asyncMap(importHook)),
    ]
    const afterEachs = [
        ...(data.afterEach || []),
        ...(await pathsAfterEach.asyncMap(importHook)),
    ]
    const beforeEachs = [
        ...(data.beforeEach || []),
        ...(await pathsBeforeEach.asyncMap(importHook)),
    ]
    test.group(name, (group: any) => {
        afterAlls.map((after) => group.teardown(after))
        beforeAlls.map((before) => group.setup(before))
        afterEachs.map((after) => group.each.teardown(after))
        beforeEachs.map((before) => group.each.setup(before))
        tests.map((e) => test(e.name, e.body))
    })
}
