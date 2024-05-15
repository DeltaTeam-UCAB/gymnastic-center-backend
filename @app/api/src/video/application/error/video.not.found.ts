import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const VIDEO_NOT_FOUND = 'VIDEO_NOT_FOUND' as const

export const videoNotFoundError = makeApplicationErrorFactory({
    name: VIDEO_NOT_FOUND,
    message: 'Video not found',
})
