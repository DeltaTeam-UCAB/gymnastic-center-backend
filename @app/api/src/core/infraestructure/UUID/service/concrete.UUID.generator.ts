import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ConcreteUUIDGenerator implements IDGenerator<string> {
    generate(): string {
        return crypto.randomUUID()
    }
}
