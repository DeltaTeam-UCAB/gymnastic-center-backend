import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_CATEGORY_ID = 'UNVALID_CATEGORY_ID'

export const unvalidCategoryId = makeDomainErrorFactory({
    name: UNVALID_CATEGORY_ID,
    message: 'Unvalid category id',
})
