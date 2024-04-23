export const isEqual = (a: any, b: any): boolean => {
    if (a === b) return true
    if (Array.isArray(a) && Array.isArray(b)) transformArray(a, b)
    if (a instanceof Date && b instanceof Date)
        return a.getTime() === b.getTime()
    if (b.__kind && typeof b === 'function') return b(a)
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
        return a === b
    if (a === null || a === undefined || b === null || b === undefined)
        return false
    const keys = Object.keys(b)
    return keys.every((k) => isEqual(a[k], b[k]))
}

const transformArray = (a: any[], b: any[]) => {
    const arrFillIndex = b.findIndex((e) => (e as any).__kind === 'ArrFiller')
    if (arrFillIndex === -1) return
    b.splice(
        arrFillIndex,
        1,
        ...new Array(a.length - (b.length - 1)).fill(
            (b[arrFillIndex] as any).data,
        ),
    )
}
