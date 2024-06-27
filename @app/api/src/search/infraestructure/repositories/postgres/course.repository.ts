import { InjectRepository } from '@nestjs/typeorm'
import { Course } from 'src/search/application/models/course'
import {
    CourseRepository,
    SearchCoursesCriteria,
} from 'src/search/application/repositories/course.repository'
import { Course as CourseORM } from '../../models/postgres/course.entity'
import { Trainer } from '../../models/postgres/trainer.entity'
import { Category } from '../../models/postgres/category.entity'
import { Repository } from 'typeorm'
import { Tag } from '../../models/postgres/tag.entity'

export class CoursePostgresBySearchRepository implements CourseRepository {
    constructor(
        @InjectRepository(CourseORM)
        private courseProvider: Repository<CourseORM>,
        @InjectRepository(Trainer) private trainerProvider: Repository<Trainer>,
        @InjectRepository(Category)
        private categoryProvider: Repository<Category>,
        @InjectRepository(Tag)
        private tagProvider: Repository<Tag>,
    ) {}
    async getMany(criteria: SearchCoursesCriteria): Promise<Course[]> {
        const tags = await (criteria.tags
            ? (JSON.parse(criteria.tags as any) as string[])
            : undefined
        )?.asyncMap(async (tag) => {
            const item = await this.tagProvider.findOneByOrFail({
                name: tag,
            })
            return item.id
        })
        const data = await this.courseProvider.query(`
(SELECT c.*, count(s.id)
	FROM public.course c, subscription s 
	where c.id = s.course and lower(c.title) like '%${
        criteria.term?.toLowerCase() ?? ''
    }%' ${
    tags && tags.isNotEmpty()
        ? `and c.id in (select "courseId" from course_tag where ${tags
            ?.map((e) => `"tagId" = '${e}'`)
            .join(' or ')})`
        : ''
}
	group by c.id, s.course 
	order by count(s.id) DESC)
UNION
(select *, 0 
	from course c 
	where c.id not in (select course from subscription) and lower(c.title) like '%${
        criteria.term?.toLowerCase() ?? ''
    }%'${
    tags && tags.isNotEmpty()
        ? `and c.id in (select "courseId" from course_tag where ${tags
            ?.map((e) => `"tagId" = '${e}'`)
            .join(' or ')})`
        : ''
}
 )
order by count DESC
offset ${criteria.perPage * (criteria.page - 1)}
limit ${criteria.perPage}
`)
        return (data as Record<any, any>[]).asyncMap<Course>(async (e) => ({
            id: e.id,
            title: e.title,
            date: new Date(e.date),
            image: e.image,
            level: e.level,
            category: (
                await this.categoryProvider.findOneByOrFail({
                    id: e.category,
                })
            ).name,
            trainer: (
                await this.trainerProvider.findOneByOrFail({
                    id: e.trainer,
                })
            ).name,
        }))
    }
}
