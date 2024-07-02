import { MongooseModule } from '@nestjs/mongoose'
import { ServiceModule } from '../../decorators/service.module'
import { UserDeviceLink, userDeviceLinkSchema } from './models/user.token'
import { MongoUserDeviceLinker } from './service/mongo.device.linker'

export const MONGO_USER_LINKER = 'MONGO_USER_LINKER'

@ServiceModule(
    [
        {
            provide: MONGO_USER_LINKER,
            useClass: MongoUserDeviceLinker,
        },
    ],
    [
        MongooseModule.forFeature([
            {
                name: UserDeviceLink.name,
                schema: userDeviceLinkSchema,
            },
        ]),
    ],
)
export class MongoDeviceLinkerModule {}
