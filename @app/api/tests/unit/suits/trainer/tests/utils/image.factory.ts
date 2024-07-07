import { Image } from '../../../../../../src/trainer/application/models/image'

export const createImage = (data?: { id?: string; src?: string }): Image => ({
    id: data?.id ?? '30f11a4e-5330-405a-93ed-2da961301b63',
    src: data?.src ?? 'test image',
})
