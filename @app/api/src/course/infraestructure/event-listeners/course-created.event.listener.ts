import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_CREATED,
    courseCreated,
} from '../../domain/events/course.created'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'
import { CourseDescription } from 'src/course/domain/value-objects/course.description'
import { CourseDuration } from 'src/course/domain/value-objects/course.duration'
import { CourseLevel } from 'src/course/domain/value-objects/course.level'
import { Trainer } from 'src/course/domain/entities/trainer'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { TrainerName } from 'src/course/domain/value-objects/trainer.name'
import { Category } from 'src/course/domain/entities/category'
import { CategoryID } from 'src/course/domain/value-objects/category.id'
import { CategoryName } from 'src/course/domain/value-objects/category.name'
import { CourseImage } from 'src/course/domain/value-objects/course.image'
import { Lesson } from 'src/course/domain/entities/lesson'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { LessonTitle } from 'src/course/domain/value-objects/lesson.title'
import { LessonContent } from 'src/course/domain/value-objects/lesson.content'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'
import { CourseTag } from 'src/course/domain/value-objects/course.tag'

@Injectable()
export class CourseCreatedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_CREATED,
            (json) =>
                courseCreated({
                    id: new CourseID(json.id._id),
                    title: new CourseTitle(json.title._title),
                    description: new CourseDescription(
                        json.description._description,
                    ),
                    duration: new CourseDuration(
                        json.duration._weeks,
                        json.duration._hours,
                    ),
                    level: new CourseLevel(json.level._level),
                    trainer: new Trainer(new TrainerID(json.trainer._id._id), {
                        name: new TrainerName(json.trainer.data.name._name),
                    }),
                    category: new Category(
                        new CategoryID(json.category._id._id),
                        {
                            name: new CategoryName(
                                json.category.data.name._name,
                            ),
                        },
                    ),
                    image: new CourseImage(json.image._image),
                    timestamp: new Date(json.timestamp),
                    tags: (json.tags as Record<any, any>[]).map(
                        (tag) => new CourseTag(tag._tag),
                    ),
                    lessons: (json.lessons as Record<any, any>[]).map(
                        (lesson) =>
                            new Lesson(new LessonID(lesson._id._id), {
                                title: new LessonTitle(
                                    lesson.data.title._title,
                                ),
                                content: new LessonContent(
                                    lesson.data.content._content,
                                ),
                                video: new LessonVideo(
                                    lesson.data.video._video,
                                ),
                            }),
                    ),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
