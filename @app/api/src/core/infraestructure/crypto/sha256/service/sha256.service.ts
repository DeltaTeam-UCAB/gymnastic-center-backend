import { Crypto } from 'src/core/application/crypto/crypto'
import { Injectable } from '@nestjs/common'
import { sha256 } from 'js-sha256'

@Injectable()
export class Sha256Service implements Crypto {
    async encrypt(value: string): Promise<string> {
        return sha256(value)
    }

    async compare(normal: string, encrypted: string): Promise<boolean> {
        return sha256(normal) === encrypted
    }
}
