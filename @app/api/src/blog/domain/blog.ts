import { AggregateRoot } from 'src/core/domain/aggregates/aggregate.root'
import { BlogId } from './value-objects/blog.id'
import { BlogTitle } from './value-objects/blog.title'
import { BlogImage } from './value-objects/blog.images'
import { BlogTag } from './value-objects/blog.tag'
import { BlogBody } from './value-objects/blog.body'
import { Trainer } from './entities/trainer'
import { Category } from './entities/category'
import { blogCreated } from './events/blog.created'
import { blogTitleChanged } from './events/blog.title.changed'
import { blogBodyChanged } from './events/blog.body.changed'
import { unvalidBlog } from './exceptions/unvalid.blog'
import { blogTagAdded } from './events/blog.tag.added'
import { blogTagRemoved } from './events/blog.tag.removed'

export class Blog extends AggregateRoot<BlogId> {
    constructor(
        id: BlogId,
        private data: {
            title: BlogTitle
            body: BlogBody
            images: BlogImage[]
            tags: BlogTag[]
            trainer: Trainer
            category: Category
        },
    ) {
        super(id)
        this.publish(
            blogCreated({
                id,
                ...data,
            }),
        )
    }

    get title() {
        return this.data.title
    }

    get body() {
        return this.data.body
    }

    get images() {
        return this.data.images
    }

    get tags() {
        return this.data.tags
    }

    get trainer() {
        return this.data.trainer
    }

    get category() {
        return this.data.category
    }

    changeTitle(title: BlogTitle) {
        this.data.title = title
        this.publish(
            blogTitleChanged({
                id: this.id,
                title,
            }),
        )
    }

    changeBody(body: BlogBody) {
        this.data.body = body
        this.publish(
            blogBodyChanged({
                id: this.id,
                body,
            }),
        )
    }

    addTag(tag: BlogTag) {
        this.data.tags.push(tag)
        this.publish(
            blogTagAdded({
                id: this.id,
                tag,
            }),
        )
    }

    removeTag(tag: BlogTag) {
        this.data.tags = this.data.tags.filter((e) => e != tag)
        this.publish(
            blogTagRemoved({
                id: this.id,
                tag,
            }),
        )
    }

    validateState(): void {
        if (
            !this.id ||
            !this.title ||
            !this.body ||
            !this.images ||
            !this.tags ||
            !this.trainer ||
            !this.category
        )
            throw unvalidBlog()
    }
}
