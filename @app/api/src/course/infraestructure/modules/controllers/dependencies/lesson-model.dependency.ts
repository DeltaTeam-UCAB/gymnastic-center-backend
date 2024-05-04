import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from 'src/course/infraestructure/models/postgres/lesson.entity'


export const LessonModel = TypeOrmModule.forFeature([Lesson])
