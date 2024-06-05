export const filterTypes = ['POPULAR', 'RECENT'] as const

export type FilterType = (typeof filterTypes)[number]

export class GetAllBlogsDTO {
    perPage: number
    page: number
    filter: FilterType
    trainer?: string
    category?: string
}
