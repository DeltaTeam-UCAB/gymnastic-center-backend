import { RandomCodeGenerator } from '../../../../../../src/core/application/random-code/random-code.generator'

export class RandomCodeMock implements RandomCodeGenerator {
    generate(max: number): string {
        return String(10 ** (max - 1))
    }
}
