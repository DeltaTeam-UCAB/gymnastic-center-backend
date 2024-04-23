import { isNotNull } from 'src/utils/null-manager/null-checker'

export class Either<L, R> {
    private constructor(private _left?: L, private _right?: R) {}

    get isLeft() {
        return Boolean(isNotNull(this._left))
    }

    get isRight() {
        return Boolean(isNotNull(this._right))
    }

    get left(): L {
        if (!isNotNull(this._left)) throw new Error('Left is empty')
        return this._left
    }

    get right(): R {
        if (!isNotNull(this._right)) throw new Error('Right is empty')
        return this._right
    }

    static left<L, R>(left: L): Either<L, R> {
        return new Either(left)
    }

    static right<L, R>(right: R): Either<L, R> {
        return new Either<L, R>(undefined, right)
    }
}
