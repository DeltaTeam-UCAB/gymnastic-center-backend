export type GetTagsCriteria = {
    page: number
    perPage: number
}

export interface TagProvider {
    getPopular(criteria: GetTagsCriteria): Promise<string[]>
}
