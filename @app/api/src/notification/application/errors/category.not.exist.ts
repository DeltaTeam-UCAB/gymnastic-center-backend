import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const CATEGORY_NOT_EXIST = 'CATEGORY_NOT_EXIST' as const

export const categoryNotExistError = makeApplicationErrorFactory({
    name: CATEGORY_NOT_EXIST,
    message: 'Category not exist',
})
