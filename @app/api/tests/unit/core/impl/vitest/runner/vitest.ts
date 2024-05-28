import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        name: 'unit',
        root: './dist_test/tests/unit/suits',
        setupFiles: ['../core/impl/vitest/runner/setup.js'],
        include: ['./**/suit.tests.js'],
        alias: {
            '#corevitest/': '../core/impl/vitest/',
        },
    },
})
