export interface DateProvider {
    get current(): Date
    getMinutesOfDifference(a: Date, b: Date): number
}
