import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDeviceLinkDocument = HydratedDocument<UserDeviceLink>

@Schema()
export class UserDeviceLink {
    @Prop({
        unique: true,
    })
    userId: string
    @Prop()
        token: string
}

export const userDeviceLinkSchema = SchemaFactory.createForClass(UserDeviceLink)
