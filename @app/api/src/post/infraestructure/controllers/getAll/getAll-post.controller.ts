import { ControllerContract } from "src/core/infraestructure/controllers/controller-model/controller.contract";
import { Controller } from "src/core/infraestructure/controllers/decorators/controller.module";
import { Posts } from "../../models/postgres/post.entity";
import { Get, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PostImages } from "../../models/postgres/post-images.entity";
import { UserGuard } from "src/user/infraestructure/guards/user.guard";

@Controller({
    path: 'post',
    docTitle: 'Post',
})
export class GetAllPostController implements ControllerContract<[limit: number, offset:number], (Posts & { images: PostImages[]})[]>{ //en el primer parametro van los parametros que quieres pasar en la funcion execute y el segundo el retorno que quieres

    constructor(

    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,

    @InjectRepository(PostImages)
    private readonly postImageRepo: Repository<PostImages>
    ){}

    @Get('getAll')
    @UseGuards(UserGuard)
    async execute( @Query('limit', ParseIntPipe) limit: number,  @Query('offset', ParseIntPipe) offset: number): Promise<(Posts & {
        images: PostImages[]
    })[]> {


        const posts = await this.postRepo.find({
            take: limit,
            skip: offset
        });
    
        return posts.asyncMap( async post => ({
            ...post,
            body: '',
            tags: [''], 
            images: await this.postImageRepo.findBy({
                postId: post.id
            })
            
        }))
    }
}