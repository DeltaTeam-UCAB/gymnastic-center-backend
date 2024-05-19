import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const FETCH_FOLLOWERS_FAILED = 'FETCH_FOLLOWERS_FAILED' as const

export const fetchFollowersFailedError = makeApplicationErrorFactory({
    name: FETCH_FOLLOWERS_FAILED,
    message: 'Something went wrong while fetching trainer followers',
})
