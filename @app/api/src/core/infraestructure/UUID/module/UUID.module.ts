import { ConcreteUUIDGenerator } from '../service/concrete.UUID.generator'
import { ServiceModule } from '../../decorators/service.module'

export const UUID_GEN_NATIVE = 'UUID_GEN_NATIVE'

@ServiceModule([
    {
        provide: UUID_GEN_NATIVE,
        useClass: ConcreteUUIDGenerator,
    },
])
export class UUIDModule {}
