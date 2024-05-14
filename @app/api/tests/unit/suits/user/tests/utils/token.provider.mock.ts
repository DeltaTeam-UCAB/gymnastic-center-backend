import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { TokenProvider } from '../../../../../../src/core/application/token/token.provider'
import { TokenPayload } from '../../../../../../src/user/application/commads/login/types/token.payload'

export class TokenProviderMock implements TokenProvider<TokenPayload> {
    sign(value: TokenPayload): Result<string> {
        return Result.success(JSON.stringify(value))
    }

    verify(value: string): Result<TokenPayload> {
        return Result.success(JSON.parse(value))
    }
}
