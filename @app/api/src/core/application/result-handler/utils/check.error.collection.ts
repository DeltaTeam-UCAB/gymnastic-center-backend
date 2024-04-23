import { Result } from '../result.handler'

export const isResultsHaveError = <T>(arr: Result<T>[]) =>
    arr.some((re) => re.isError())
