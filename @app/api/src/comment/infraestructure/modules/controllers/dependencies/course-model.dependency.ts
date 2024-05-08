import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from 'src/course/infraestructure/models/postgres/course.entity'

export const CourseModel = TypeOrmModule.forFeature([Course])
