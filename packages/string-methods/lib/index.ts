type CallBackFilter = (
    value: string,
    index: number,
    str: string,
) => Promise<boolean>
type CallBackFilterSync = (value: string, index: number, str: string) => boolean

declare global {
    interface String {
        isEmpty(): boolean
        isNotEmpty(): boolean
        isInRage(lower: number, greater: number): boolean
        reverse(): string
        asyncMap(
            callback: (e: string, i: number, str: string) => Promise<string>,
        ): Promise<string>
        map(callback: (e: string, i: number, str: string) => string): string
        asyncFilter(callback: CallBackFilter): Promise<string>
        filter(callback: CallBackFilterSync): string
        asyncFilterWithComplement(
            callback: CallBackFilter,
        ): Promise<[string, string]>
        filterWithComplement(callback: CallBackFilterSync): [string, string]
        with(index: number, element: string): string
        replaceRight(pattern: string | RegExp, value: string): string
        capitalize(): string
        capitalizeFirst(): string
        trimCharcter(char: string): string
        trimCharcterStart(char: string): string
        trimCharcterEnd(char: string): string
        at(index: number): string | undefined
        get lastIndex(): number
        get last(): string
        pop(n?: number): string
        shift(n?: number): string
    }
}

if (!String.prototype.pop)
    String.prototype.pop = function (this: string, n: number = 1) {
        const elements = this.split('')
        new Array(n).fill(0).forEach(() => elements.pop())
        return elements.join('')
    }

if (!String.prototype.shift)
    String.prototype.shift = function (this: string, n: number = 1) {
        const elements = this.split('')
        new Array(n).fill(0).forEach(() => elements.shift())
        return elements.join('')
    }

if (!String.prototype.lastIndex)
    Object.defineProperty(String.prototype, 'lastIndex', {
        get(this: string) {
            return this.length - 1
        },
    })

if (!String.prototype.last)
    Object.defineProperty(String.prototype, 'last', {
        get(this: string) {
            return this.at(-1)
        },
    })

if (!String.prototype.at)
    String.prototype.at = function (this: string, index: number) {
        return this.split('').at(index)
    }

if (!String.prototype.trimCharcter)
    String.prototype.trimCharcter = function (this: string, char: string) {
        const regex = new RegExp(`(^[${char}]*)|([${char}]*$)`, 'g')
        return this.replaceAll(regex, '')
    }

if (!String.prototype.trimCharcterStart)
    String.prototype.trimCharcterStart = function (this: string, char: string) {
        const regex = new RegExp(`(^[${char}]*)`, 'g')
        return this.replaceAll(regex, '')
    }

if (!String.prototype.trimCharcterEnd)
    String.prototype.trimCharcterEnd = function (this: string, char: string) {
        const regex = new RegExp(`([${char}]*$)`, 'g')
        return this.replaceAll(regex, '')
    }

if (!String.prototype.capitalizeFirst)
    String.prototype.capitalizeFirst = function (this: string) {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }

if (!String.prototype.capitalize)
    String.prototype.capitalize = function (this: string) {
        return this.split(' ')
            .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
            .join(' ')
    }

if (!String.prototype.replaceRight)
    String.prototype.replaceRight = function (this: string, pattern, value) {
        if (typeof pattern === 'string')
            return this.reverse()
                .replace(pattern.reverse(), value.reverse())
                .reverse()
        if (pattern.flags.includes('g')) return this.replace(pattern, value)
        pattern = new RegExp(pattern, 'g')
        const match = [...this.matchAll(pattern)].at(-1)
        if (!match) return this
        return this.reverse()
            .replace(match[0].reverse(), value.reverse())
            .reverse()
    }

String.prototype.isEmpty = function (): boolean {
    return this.length === 0
}

String.prototype.isNotEmpty = function (): boolean {
    return this.length !== 0
}

String.prototype.isInRage = function (lower, greater) {
    return this.lenght >= lower && this.lenght <= greater
}

String.prototype.asyncMap = async function (this: string, callback) {
    const newStr = await Promise.all(
        this.split('').map((e, i) => callback(e, i, this)),
    )
    return newStr.join('')
}

String.prototype.map = function (this: string, callback) {
    return this.split('')
        .map((e, i) => callback(e, i, this))
        .join('')
}

String.prototype.asyncFilter = async function (this: string, cb) {
    const filteredResults: any[] = []
    for (const [index, element] of this.split('').entries()) {
        if (await cb(element, index, this)) {
            filteredResults.push(element)
        }
    }
    return filteredResults.join('')
}

String.prototype.filter = function (this: string, cb) {
    const filteredResults: any[] = []
    for (const [index, element] of this.split('').entries()) {
        if (cb(element, index, this)) {
            filteredResults.push(element)
        }
    }
    return filteredResults.join('')
}

String.prototype.filterWithComplement = function (this: string, callback) {
    const arrSet: any[] = []
    const complement: any[] = []
    for (const [index, element] of this.split('').entries()) {
        if (callback(element, index, this)) {
            arrSet.push(element)
        } else {
            complement.push(element)
        }
    }
    return [arrSet.join(''), complement.join('')]
}

String.prototype.asyncFilterWithComplement = async function (
    this: string,
    callback,
) {
    const arrSet: any[] = []
    const complement: any[] = []
    for (const [index, element] of this.split('').entries()) {
        if (await callback(element, index, this)) {
            arrSet.push(element)
        } else {
            complement.push(element)
        }
    }
    return [arrSet.join(''), complement.join('')]
}

if (!String.prototype.with)
    String.prototype.with = function (this: string, index: number, element) {
        if (index < 0 || index > this.length) throw new Error('Invalid index')
        return this.map((e, i) => (i !== index ? e : element))
    }

if (!String.prototype.reverse)
    String.prototype.reverse = function (this: string) {
        return this.split('').reverse().join('')
    }

declare global {
    interface StringConstructor {
        isString<T>(value: T): boolean
    }
}

String.isString = <T>(value: T): boolean => typeof value === 'string'

export default null
