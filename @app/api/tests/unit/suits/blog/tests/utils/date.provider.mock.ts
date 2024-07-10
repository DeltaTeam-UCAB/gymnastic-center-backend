import { DateProvider } from '../../../../../../src/core/application/date/date.provider'

export class DateProviderMock implements DateProvider {
    constructor(private date = new Date(), private minutes?: number) {}
    get current(): Date {
        return this.date
    }

    getMinutesOfDifference(a: Date, b: Date): number {
        return (
            this.minutes ?? Math.floor((a.getTime() - b.getTime()) / 1000 / 60)
        )
    }
}
