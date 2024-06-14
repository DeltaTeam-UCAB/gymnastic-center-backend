import { Video } from '../../../../../../src/course/application/models/video'

export const createVideo = (data?: { id?: string; src?: string }): Video => ({
    id: data?.id ?? '123456789',
    src: data?.src ?? 'test video',
})
