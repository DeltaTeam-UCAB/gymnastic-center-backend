import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const EXIST_POST = 'EXIST_POST'

export const existPost = makeApplicationErrorFactory({
    name: EXIST_POST,
    message: 'Existing post',
})
