import { Crypto } from '../../../../../../src/core/application/crypto/crypto'

export class CryptoMock implements Crypto {
    async encrypt(value: string): Promise<string> {
        return value
    }

    async compare(normal: string, encrypted: string): Promise<boolean> {
        return normal === encrypted
    }
}
