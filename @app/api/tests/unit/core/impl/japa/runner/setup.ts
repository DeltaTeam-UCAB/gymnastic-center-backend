import '@mono/array-methods'
import '@mono/string-methods'
import '@mono/number-methods'
import '@mono/object-utils'
import '@mono/promise-methods'
import { expect } from '@japa/expect'
import { configure, processCLIArgs, run } from '@japa/runner'

processCLIArgs(process.argv.splice(2))

configure({
    files: ['./dist_test/tests/unit/suits/**/suit.tests.js'],
    plugins: [expect()],
})

run()
