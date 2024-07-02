import { Injectable } from '@nestjs/common'
import { DeviceLinker } from '../../device.linker'
import { InjectModel } from '@nestjs/mongoose'
import { UserDeviceLink } from '../models/user.token'
import { Model } from 'mongoose'
import { Optional } from '@mono/types-utils'

@Injectable()
export class MongoUserDeviceLinker implements DeviceLinker {
    constructor(
        @InjectModel(UserDeviceLink.name)
        private linkModel: Model<UserDeviceLink>,
    ) {}
    async link(userId: string, token: string): Promise<void> {
        await this.linkModel.findOneAndUpdate(
            {
                userId,
            },
            {
                userId,
                token,
            },
            {
                upsert: true,
            },
        )
    }

    async isLinked(userId: string, token: string): Promise<boolean> {
        const link = await this.linkModel.findOne({
            userId,
        })
        return link?.userId === userId && link.token === token
    }

    async getByUser(userId: string): Promise<Optional<string>> {
        const data = await this.linkModel.findOne({
            userId,
        })
        return data?.token
    }
}
