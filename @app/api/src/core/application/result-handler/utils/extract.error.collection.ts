import { Result } from '../result.handler'

export const extractErrorFromCollection = <T>(arr: Result<T>[]) =>
    arr.find((re) => re.isError())
