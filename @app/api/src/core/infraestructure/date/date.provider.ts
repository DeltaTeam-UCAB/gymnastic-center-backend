import { DateProvider } from 'src/core/application/date/date.provider'

export class ConcreteDateProvider implements DateProvider {
    get current(): Date {
        return new Date()
    }

    getMinutesOfDifference(a: Date, b: Date): number {
        return Math.floor((a.getTime() - b.getTime()) / 1000 / 60)
    }
}
