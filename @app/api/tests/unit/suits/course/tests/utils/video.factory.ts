import { Video } from '../../../../../../src/course/application/models/video'

export const createVideo = (data?: { id?: string; src?: string }): Video => ({
    id: data?.id ?? '17bafccd-15d1-4804-a59b-7833973ff26d',
    src: data?.src ?? 'test video',
})
