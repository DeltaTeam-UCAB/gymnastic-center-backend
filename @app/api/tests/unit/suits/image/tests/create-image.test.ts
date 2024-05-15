import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { SaveImageCommand } from '../../../../../src/image/application/commands/save/save.image.command'
import { SaveImageResponse } from '../../../../../src/image/application/commands/save/types/response'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { ImageStorageMock } from './utils/image.manager.mock'
import { ImageRepositoryMock } from './utils/image.repository.mock'

export const name = 'Should create a image with path'
export const body = async () => {
    const imageRepo = new ImageRepositoryMock()
    const result: Result<SaveImageResponse> = await new SaveImageCommand(
        new IDGeneratorMock(),
        imageRepo,
        new ImageStorageMock(),
    ).execute({
        path: 'test path',
    })
    lookFor(result.isError()).equals(false)
    lookFor(await imageRepo.getAll()).toDeepEqual([
        {
            id: '1234567890',
            src: 'test path',
        },
    ])
}
