import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const CATEGORY_NAME_EXIST = 'CATEGORY_NAME_EXIST' as const

export const categoryNameExistError = makeApplicationErrorFactory({
    name: CATEGORY_NAME_EXIST,
    message: 'Category name exist',
})
