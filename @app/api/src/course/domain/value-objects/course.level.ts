import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCourseLevel } from '../exceptions/unvalid.course.level'

export const levels = ['EASY', 'MEDIUM', 'HARD'] as const
type LEVELS = (typeof levels)[number]
export class CourseLevel implements ValueObject<CourseLevel> {
    constructor(private _level: LEVELS) {
        if (!levels.includes(_level)) throw unvalidCourseLevel()
    }
    get level() {
        return this._level
    }
    equals(other?: CourseLevel | undefined): boolean {
        return other?.level === this.level
    }
}
