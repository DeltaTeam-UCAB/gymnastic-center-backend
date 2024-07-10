import { Optional } from '@mono/types-utils'
import { Client } from '../models/client'

export interface ClientRepository {
    getById(id: string): Promise<Optional<Client>>
    getAll(): Promise<Client[]>
}
