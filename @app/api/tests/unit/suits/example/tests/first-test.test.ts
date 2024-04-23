import { ComparationUtils as C, match } from '@mono/pattern-matching'
import { makeApplicationErrorFactory } from '../../../../../src/core/application/error/application.error'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'

export const name = 'firstTest'
export const body = () => {
    match({
        a: [1, '', '', '', 1],
        b: 1,
    })
        .with(
            {
                a: [1, ...C.ArrayFiller(C.String), 1],
                b: C.Any,
            },
            () => console.log('arr'),
        )
        .otherwise(() => console.log('default1'))
    lookFor(true).equals(true)
    lookFor({
        a: 'test',
    }).toMathObject({
        a: 'test',
    })
    lookFor({
        a: 'test',
    }).toBeTruthy()
    const errorTest = makeApplicationErrorFactory({
        message: 'test',
        name: 'error1',
    })
    Result.error(errorTest())
}
