export const name = 'second test'
export const body = () => {
    lookFor({
        a: '',
    }).toMathObject({
        a: '',
    })
    lookFor(2 + 2).equals(4)
}
