declare global {
    interface Number {
        nextInt(): number
        toFixedNumber(digits?: number): number
        equals(other: number): boolean
        lenghtInt(): number
        lenghtDecimal(): number
    }
}

Number.prototype.nextInt = function () {
    return Math.ceil(this)
}

Number.prototype.toFixedNumber = function (this: number, digits?: number) {
    return Number(this.toFixed(digits))
}

Number.prototype.equals = function (this: number, other: number) {
    if (Number.isNaN(this) && Number.isNaN(other)) return true
    return this === other
}

Number.prototype.lenghtInt = function (this: number) {
    return this.toFixed(0).length
}

Number.prototype.lenghtDecimal = function (this: number) {
    if (!this.toString().includes('.')) return 0
    return this.toString().split('.').at(-1)!.length
}

export default null
