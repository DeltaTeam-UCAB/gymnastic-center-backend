import { Image } from '../../../../../../src/blog/application/models/image'

export const createImage = (data?: { id?: string; src?: string }): Image => ({
    id: data?.id ?? '1234567890',
    src: data?.src ?? 'test image',
})
