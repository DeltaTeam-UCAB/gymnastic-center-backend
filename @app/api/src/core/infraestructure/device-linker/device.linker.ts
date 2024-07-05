import { Optional } from '@mono/types-utils'

export interface DeviceLinker {
    link(userId: string, token: string): Promise<void>
    isLinked(userId: string, token: string): Promise<boolean>
    getByUser(userId: string): Promise<Optional<string>>
}
