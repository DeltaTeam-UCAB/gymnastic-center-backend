import { Image } from '../../../../../../src/image/application/models/image'

export const createImage = (data?: { id?: string; src?: string }): Image => ({
    id: data?.id ?? '123456789',
    src: data?.src ?? 'test image',
})
