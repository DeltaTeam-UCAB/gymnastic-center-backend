import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Video } from 'src/course/application/models/video'
import { VideoRepository } from 'src/course/application/repositories/video.repository'
import { Video as VideoORM } from '../../models/postgres/video.entity'
import { Repository } from 'typeorm'

@Injectable()
export class VideoPostgresByCourseRepository implements VideoRepository {
    constructor(
        @InjectRepository(VideoORM) private videoProvider: Repository<VideoORM>,
    ) {}
    getById(id: string): Promise<Optional<Video>> {
        return this.videoProvider.findOneBy({
            id,
        })
    }
    existById(id: string): Promise<boolean> {
        return this.videoProvider.existsBy({
            id,
        })
    }
}
