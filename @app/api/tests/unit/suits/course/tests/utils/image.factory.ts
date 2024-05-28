import { Image } from '../../../../../../src/course/application/models/image'

export const createImage = (data?: { id?: string; src?: string }): Image => ({
    id: data?.id ?? '123456789',
    src: data?.src ?? 'test image',
})
