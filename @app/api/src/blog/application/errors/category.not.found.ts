import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND'

export const categoryNotFoundError = makeApplicationErrorFactory({
    name: CATEGORY_NOT_FOUND,
    message: 'Category not found',
})
