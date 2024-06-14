import { randomInt } from 'node:crypto'
import { RandomCodeGenerator } from 'src/core/application/random-code/random-code.generator'

export class CryptoRandomCodeGenerator implements RandomCodeGenerator {
    generate(max: number): string {
        return randomInt(0, 9 * 10 ** (max - 1))
            .toString()
            .padStart(max, '0')
    }
}
