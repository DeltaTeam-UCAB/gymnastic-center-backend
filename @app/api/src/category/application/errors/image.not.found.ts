import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const IMAGE_NOT_FOUND = 'IMAGE_NOT_FOUND' as const

export const imageNotFoundError = makeApplicationErrorFactory({
    name: IMAGE_NOT_FOUND,
    message: 'Image not found',
})
