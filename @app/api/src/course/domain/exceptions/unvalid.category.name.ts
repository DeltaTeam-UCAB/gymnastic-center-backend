import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_CATEGORY_NAME = 'UNVALID_CATEGORY_NAME'

export const unvalidCategoryName = makeDomainErrorFactory({
    name: UNVALID_CATEGORY_NAME,
    message: 'Unvalid category name',
})
