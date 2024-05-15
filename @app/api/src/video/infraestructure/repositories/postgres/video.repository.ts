import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Video } from 'src/video/application/models/video'
import { VideoRepository } from 'src/video/application/repositories/video.repository'
import { Video as VideoORM } from '../../models/postgres/video.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class VideoPostgresRepository implements VideoRepository {
    constructor(
        @InjectRepository(VideoORM) private videoProvider: Repository<VideoORM>,
    ) {}
    async save(video: Video): Promise<Result<Video>> {
        await this.videoProvider.save(this.videoProvider.create(video))
        return Result.success(video)
    }

    getAll(): Promise<Video[]> {
        return this.videoProvider.find()
    }

    getById(id: string): Promise<Optional<Video>> {
        return this.videoProvider.findOneBy({
            id,
        })
    }
}
