import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type DomainEventDocument = HydratedDocument<DomainEvent>

@Schema()
export class DomainEvent {
    @Prop({
        required: true,
    })
    name: string
    @Prop({
        required: true,
    })
    timestamp: Date
    @Prop({
        type: 'object',
    })
    data: Record<string, any>
}

export const DomainEventSchema = SchemaFactory.createForClass(DomainEvent)
