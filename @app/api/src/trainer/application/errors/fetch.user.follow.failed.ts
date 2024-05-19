import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const FETCH_USER_FOLLOW_FAILED = 'FETCH_USER_FOLLOW_FAILED' as const

export const fetchUserFollowFailedError = makeApplicationErrorFactory({
    name: FETCH_USER_FOLLOW_FAILED,
    message: 'Something went wrong while fetching user follow',
})
