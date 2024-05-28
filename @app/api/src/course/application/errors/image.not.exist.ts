import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const IMAGE_NOT_EXIST = 'IMAGE_NOT_EXIST'

export const imageNotExistError = makeApplicationErrorFactory({
    name: IMAGE_NOT_EXIST,
    message: 'Image not exist',
})
