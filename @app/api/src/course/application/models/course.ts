import { Video } from 'src/video/application/models/video'
import { Image } from 'src/image/application/models/image'

export type course = {
    id: string
    title: string
    description: string
    instructor: string
    calories: number
    creationDate: Date
    updateDate: Date
    category: string
    Image: Image
    video?: Video
}
