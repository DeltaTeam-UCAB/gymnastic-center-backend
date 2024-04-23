import { globSync } from 'glob'
import { join } from 'node:path'
import { objectValues } from '@mono/object-utils'

export const initializeControllers = (currentPath: string) => {
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
