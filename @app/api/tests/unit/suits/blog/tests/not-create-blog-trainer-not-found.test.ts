import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { IdGeneratorMock } from './utils/id.generator.mock'
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { CreateBlogDTO } from '../../../../../src/blog/application/commands/create/types/dto'
import { CreateBlogResponse } from '../../../../../src/blog/application/commands/create/types/response'
import { TRAINER_NOT_FOUND } from '../../../../../src/blog/application/errors/trainer.not.found'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { decorateCreateCommand } from './utils/decorate.create.command.factory'
import { createTrainer } from './utils/trainer.factory'
import { createCategory } from './utils/category.factory'

export const name = 'Should not create blog if title exist'
const date = new DateProviderMock(new Date())
export const body = async () => {
    const trainer = createTrainer()
    const category = createCategory()
    const categoryRepository = new CategoryRepositoryMock([category])
    const trainerRepository = new TrainerRepositoryMock([trainer])
    const blogBaseData = {
        title: 'test blog',
        body: 'test made for blog body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: category.id,
        trainer: '127364',
        date: date.current,
    } satisfies CreateBlogDTO
    const blogRepository = new BlogRepositoryMock()
    const decoratedCommand = decorateCreateCommand(
        new IdGeneratorMock(),
        blogRepository,
        trainerRepository,
        categoryRepository,
    )
    const result: Result<CreateBlogResponse> = await decoratedCommand.execute(
        blogBaseData,
    )
    result.handleError((e) => {
        lookFor(e.name).equals(TRAINER_NOT_FOUND)
    })
}
