import { Image } from '../../../../../../src/blog/application/models/image'

export const createImage = (data?: { id?: string; src?: string }): Image => ({
    id: data?.id ?? '84821c3f-0e66-4bf4-a3a8-520e42e54147',
    src: data?.src ?? 'test image',
})
