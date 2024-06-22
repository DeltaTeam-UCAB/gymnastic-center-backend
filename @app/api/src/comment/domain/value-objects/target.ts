import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { unvalidTargetBlogId } from '../exceptions/unvalid.target.blog.id'
import { unvalidTargetLessonId } from '../exceptions/unvalid.target.lesson.id'
import { noBlogTarget } from '../exceptions/no.blog.target'
import { noLessonTarget } from '../exceptions/no.lesson.target'
import { BlogID } from './blog.id'
import { LessonID } from './lesson.id'

export class Target implements ValueObject<Target> {
    private constructor(
        private _blogId?: BlogID,
        private _lessonId?: LessonID,
    ) {
        if (isNotNull(_blogId) && !regExpUUID.test(_blogId.id))
            throw unvalidTargetBlogId()
        if (isNotNull(_lessonId) && !regExpUUID.test(_lessonId.id))
            throw unvalidTargetLessonId()
    }

    equals(other?: Target | undefined): boolean {
        if (other?.lessonTarget() && this.lessonTarget())
            return other.lesson === this.lesson

        if (other?.blogTarget() && this.blogTarget())
            return other.blog === this.blog

        return false
    }

    blogTarget(): boolean {
        return isNotNull(this._blogId)
    }

    lessonTarget(): boolean {
        return isNotNull(this._lessonId)
    }

    get blog() {
        if (!this.blogTarget()) throw noBlogTarget()
        return this._blogId as BlogID
    }

    get lesson() {
        if (!this.lessonTarget()) throw noLessonTarget()
        return this._lessonId as LessonID
    }

    static blog(id: BlogID): Target {
        return new Target(id)
    }

    static lesson(id: LessonID): Target {
        return new Target(undefined, id)
    }
}
