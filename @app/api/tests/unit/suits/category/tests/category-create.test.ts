import { ImageRepositoryMock } from '../../image/tests/utils/image.repository.mock'
import { CreateCategoryCommand } from '../../../../../src/category/application/commands/create/create.category.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateCategoryResponse } from '../../../../../src/category/application/commands/create/types/reponse'

export const name = 'Should create category with valid data'
export const body = async () => {
    const imageRepository = new ImageRepositoryMock([
        {
            id: 'imageId',
            src: 'test image',
        },
    ])
    const categoryRepository = new CategoryRepositoryMock()
    const result: Result<CreateCategoryResponse> =
        await new CreateCategoryCommand(
            new IDGeneratorMock(),
            categoryRepository,
            imageRepository,
        ).execute({
            name: 'test',
            icon: 'imageId',
        })
    lookFor(result.isError()).equals(false)
    lookFor(await categoryRepository.findByName('test')).toDeepEqual({
        id: '1234567890',
        name: 'test',
        icon: 'imageId',
    })
}
