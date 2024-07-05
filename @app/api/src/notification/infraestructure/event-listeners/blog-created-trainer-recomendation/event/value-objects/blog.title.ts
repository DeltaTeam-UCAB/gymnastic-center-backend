import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidBlogTitle } from '../exceptions/unvalid.blog.title'

export class BlogTitle implements ValueObject<BlogTitle> {
    constructor(private _title: string) {
        if (_title.length < 5) throw unvalidBlogTitle()
    }
    get title() {
        return this._title
    }

    equals(other?: BlogTitle | undefined): boolean {
        return other?.title === this.title
    }
}
