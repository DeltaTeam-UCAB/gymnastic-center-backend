import { AggregateRoot } from 'src/core/domain/aggregates/aggregate.root'
import { Result } from '../result-handler/result.handler'

type UnwrapAggregateId<T extends AggregateRoot<any>> = T extends AggregateRoot<
    infer U
>
    ? U
    : never

export interface Repository<T extends AggregateRoot<any>> {
    save(aggregate: T): Promise<Result<boolean>>
    delete(aggregate: T): Promise<Result<boolean>>
    getById(id: UnwrapAggregateId<T>): Promise<Result<T>>
}
