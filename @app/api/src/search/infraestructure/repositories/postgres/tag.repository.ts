import { Injectable } from '@nestjs/common'
import {
    GetTagsCriteria,
    TagProvider,
} from 'src/search/application/services/tag.provider'
import { DataSource } from 'typeorm'

@Injectable()
export class TagPostgresRepository implements TagProvider {
    constructor(private dataSource: DataSource) {}
    async getPopular(criteria: GetTagsCriteria): Promise<string[]> {
        const queryRunner = this.dataSource.createQueryRunner()
        const data = await queryRunner.query(`
select v.id, v.name from ((SELECT t.*, count(c."tagId")
	FROM public.tag t 
	inner join course_tag c on c."tagId" = t.id
	group by t.id, c."tagId")
UNION ALL
(SELECT t.*, count(c."tagId")
	FROM public.tag t 
	inner join blog_tag c on c."tagId" = t.id
	group by t.id, c."tagId")) as v
group by v.id, v.name
order by sum(v.count) DESC
offset ${criteria.perPage * (criteria.page - 1)}
limit ${criteria.perPage}
`)
        return data.map((e) => e.name)
    }
}
