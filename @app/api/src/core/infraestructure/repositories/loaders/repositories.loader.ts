import { globSync } from 'glob'
import { dirname, join } from 'node:path'
import { objectValues } from '@mono/object-utils'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const initializeRepositories = (folder: string) => {
    const repositoriesPart = globSync(
        join(
            __dirname,
            `../../../../**/infraestructure/repositories/${folder}/**/index.js`,
        ).replace(/\\/g, '/'),
    )
    const repositoriesUni = globSync(
        join(
            __dirname,
            `../../../../**/infraestructure/repositories/${folder}/*.repository.js`,
        ).replace(/\\/g, '/'),
    )
    return [...repositoriesUni, ...repositoriesPart].asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}
