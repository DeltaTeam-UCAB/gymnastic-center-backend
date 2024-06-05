import { CreateBlogCommand } from '../../../../../../src/blog/application/commands/create/create.blog.command'
import { CategoryExistDecorator } from '../../../../../../src/blog/application/commands/create/decorators/category.exist.decorator'
import { BlogTitleNotExistDecorator } from '../../../../../../src/blog/application/commands/create/decorators/title.exist.decorator'
import { TrainerExistDecorator } from '../../../../../../src/blog/application/commands/create/decorators/trainer.exist.decorator'
import { BlogRepository } from '../../../../../../src/blog/application/repositories/blog.repository'
import { TrainerRepository } from '../../../../../../src/blog/application/repositories/trainer.repository'
import { CategoryRepository } from '../../../../../../src/blog/application/repositories/category.repository'
import { IDGenerator } from '../../../../../../src/core/application/ID/ID.generator'

export const decorateCreateCommand = (
    idGen: IDGenerator<string>,
    blogRepository: BlogRepository,
    trainerRepository: TrainerRepository,
    categoryRepository: CategoryRepository,
) => {
    const commandBase = new CreateBlogCommand(idGen, blogRepository)
    const commandWithTitleValidator = new BlogTitleNotExistDecorator(
        commandBase,
        blogRepository,
    )
    const commandWithTrainerValidator = new TrainerExistDecorator(
        commandWithTitleValidator,
        trainerRepository,
    )
    const commandWithCategoryValidator = new CategoryExistDecorator(
        commandWithTrainerValidator,
        categoryRepository,
    )

    return commandWithCategoryValidator
}
