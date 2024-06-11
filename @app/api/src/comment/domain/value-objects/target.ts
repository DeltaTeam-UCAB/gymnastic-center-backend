import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { unvalidTargetBlogId } from '../exceptions/unvalid.target.blog.id'
import { unvalidTargetLessonId } from '../exceptions/unvalid.target.lesson.id'
import { noBlogTarget } from '../exceptions/no.blog.target'
import { noLessonTarget } from '../exceptions/no.lesson.target'

export class Target implements ValueObject<Target> {
    private constructor(private _blogId?: string, private _lessonId?: string) {
        if (isNotNull(_blogId) && !regExpUUID.test(_blogId))
            throw unvalidTargetBlogId()
        if (isNotNull(_lessonId) && !regExpUUID.test(_lessonId))
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
        return this._blogId as string
    }

    get lesson() {
        if (!this.lessonTarget()) throw noLessonTarget()
        return this._lessonId as string
    }

    static blog(id: string): Target {
        return new Target(id)
    }

    static lesson(id: string): Target {
        return new Target(undefined, id)
    }
}
