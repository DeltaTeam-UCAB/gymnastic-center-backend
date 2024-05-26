import { globSync } from 'glob'
import { join } from 'node:path'

const importTestSuits = () => {
    const data = globSync(
        join(__dirname, '../../../../suits/**/suit.tests.js').replace(
            /\\/g,
            '/',
        ),
    )
    return data.asyncMap((e) => import('file:///' + e))
}

await importTestSuits()
