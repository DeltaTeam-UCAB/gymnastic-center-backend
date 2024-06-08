import { Course } from '../../../../../src/course/domain/course'
import { Category } from '../../../../../src/course/domain/entities/category'
import { Lesson } from '../../../../../src/course/domain/entities/lesson'
import { Trainer } from '../../../../../src/course/domain/entities/trainer'
import { CategoryID } from '../../../../../src/course/domain/value-objects/category.id'
import { CategoryName } from '../../../../../src/course/domain/value-objects/category.name'
import { CourseDescription } from '../../../../../src/course/domain/value-objects/course.description'
import { CourseDuration } from '../../../../../src/course/domain/value-objects/course.duration'
import { CourseID } from '../../../../../src/course/domain/value-objects/course.id'
import { CourseImage } from '../../../../../src/course/domain/value-objects/course.image'
import { CourseLevel } from '../../../../../src/course/domain/value-objects/course.level'
import { CourseTag } from '../../../../../src/course/domain/value-objects/course.tag'
import { CourseTitle } from '../../../../../src/course/domain/value-objects/course.title'
import { LessonContent } from '../../../../../src/course/domain/value-objects/lesson.content'
import { LessonID } from '../../../../../src/course/domain/value-objects/lesson.id'
import { LessonTitle } from '../../../../../src/course/domain/value-objects/lesson.title'
import { LessonVideo } from '../../../../../src/course/domain/value-objects/lesson.video'
import { TrainerID } from '../../../../../src/course/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../src/course/domain/value-objects/trainer.name'

export const name = 'Shoul create a course aggregate'
export const body = () => {
    const course = new Course(
        new CourseID('8b1d451d-ab49-42eb-91f6-4949cf0b8574'),
        {
            title: new CourseTitle('test course'),
            description: new CourseDescription('description'),
            level: new CourseLevel('EASY'),
            duration: new CourseDuration(0, 0),
            tags: [new CourseTag('test')],
            trainer: new Trainer(
                new TrainerID('2483a13e-12cd-4ece-9402-8c46b7bfb0a6'),
                {
                    name: new TrainerName('traner test'),
                },
            ),
            category: new Category(
                new CategoryID('0c9b91f7-c739-4a88-9c94-594b5005ccb8'),
                {
                    name: new CategoryName('category test'),
                },
            ),
            image: new CourseImage('970e27bf-8716-4240-bfb3-7917cafeab03'),
            lessons: [
                new Lesson(
                    new LessonID('bec294c2-ccdc-4631-b72f-7bc4cf9be4e3'),
                    {
                        title: new LessonTitle('lesson test'),
                        content: new LessonContent('test content'),
                        video: new LessonVideo(
                            'b975b949-c909-4bfa-812b-2578c6461b58',
                        ),
                    },
                ),
            ],
        },
    )
    lookFor(course).toBeDefined()
}
