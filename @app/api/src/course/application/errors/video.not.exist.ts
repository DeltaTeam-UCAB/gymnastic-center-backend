import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const VIDEO_NOT_EXIST = 'VIDEO_NOT_EXIST'

export const videoNotExistError = makeApplicationErrorFactory({
    name: VIDEO_NOT_EXIST,
    message: 'Video not exist',
})
