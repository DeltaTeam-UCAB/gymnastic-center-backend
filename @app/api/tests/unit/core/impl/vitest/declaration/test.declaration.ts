import { SuitDeclaration, TestDeclaration } from '@mono/test-utils'
import {
    afterAll,
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    it,
} from 'vitest'
import { getCallStack } from 'src/utils/call-stack/get.call.stack'
import { objectValues } from '@mono/object-utils'
import { join } from 'node:path'
import { globSync } from 'glob'

const importHook = async (e: string) => {
    const module = await import('file:///' + e)
    return objectValues(module)[0]
}

export const vitestSuitDeclartion: SuitDeclaration = async (
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
    ;(data.options?.only || data.options?.skip
        ? describe[Object.keys(data.options)[0]]
        : describe)(name, () => {
        afterAlls.map((after) => afterAll(after))
        beforeAlls.map((before) => beforeAll(before))
        afterEachs.map((after) => afterEach(after))
        beforeEachs.map((before) => beforeEach(before))
        const testCallback = (e: TestDeclaration) => {
            if (e.options?.skip) {
                it(e.name + ' skipped', () => {})
                return
            }
            it(e.name, e.body)
        }
        tests.some((e) => e.options?.only)
            ? tests.filter((e) => e.options.only).map(testCallback)
            : tests.map(testCallback)
    })
}
