import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from 'src/lesson/infraestructure/models/postgres/lesson.entity'

export const CourseModel = TypeOrmModule.forFeature([Lesson])
