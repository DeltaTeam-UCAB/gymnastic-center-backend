import { ImageRepositoryMock } from '../../image/tests/utils/image.repository.mock'
import { CreateCategoryCommand } from '../../../../../src/category/application/commands/create/create.category.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateCategoryResponse } from '../../../../../src/category/application/commands/create/types/reponse'
import { CATEGORY_NAME_EXIST } from '../../../../../src/category/application/errors/category.name.exist'

export const name = 'Should not create category with repeated name'
export const body = async () => {
    const imageRepository = new ImageRepositoryMock([
        {
            id: 'imageId',
            src: 'test image',
        },
    ])
    const categoryRepository = new CategoryRepositoryMock([
        {
            id: '12345678',
            name: 'test',
            icon: 'test icon',
        },
    ])
    const result: Result<CreateCategoryResponse> =
        await new CreateCategoryCommand(
            new IDGeneratorMock(),
            categoryRepository,
            imageRepository,
        ).execute({
            name: 'test',
            icon: 'imageId',
        })
    result.handleError((e) => {
        lookFor(e.name).equals(CATEGORY_NAME_EXIST)
    })
}
