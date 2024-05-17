import { ImageRepositoryMock } from '../../image/tests/utils/image.repository.mock'
import { CreateCategoryCommand } from '../../../../../src/category/application/commands/create/create.category.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateCategoryResponse } from '../../../../../src/category/application/commands/create/types/reponse'
import { IMAGE_NOT_FOUND } from '../../../../../src/category/application/errors/image.not.found'

export const name = 'Should not create category without image'
export const body = async () => {
    const imageRepository = new ImageRepositoryMock()
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
    result.handleError((e) => {
        lookFor(e.name).equals(IMAGE_NOT_FOUND)
    })
}
