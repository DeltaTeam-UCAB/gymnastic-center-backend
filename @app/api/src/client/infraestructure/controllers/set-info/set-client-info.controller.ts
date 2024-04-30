import { Body, HttpException, Post } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ControllerContract } from "src/core/infraestructure/controllers/controller-model/controller.contract"
import { Controller } from "src/core/infraestructure/controllers/decorators/controller.module"
import { SetClientInfoDTO } from "./dto/set.client.info.dto"
import { Client } from "../../models/postgres/client.entity"
import { Repository } from "typeorm"
import { User } from "src/user/infraestructure/models/postgres/user.entity"

@Controller({
    path: 'client',
    docTitle: 'Client',
})
export class SetClientInfoController
    implements
        ControllerContract<
            [body: SetClientInfoDTO],
            {
                message:string
            }
        >
{
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Client) private clientRepo: Repository<Client>,
    ) {}
    @Post('set-info')
    async execute(@Body() body: SetClientInfoDTO): Promise<{ message:string }> {
        
        const possibleUser = await this.userRepo.findOneBy({
            id: body.id
        });
        if (!possibleUser) throw new HttpException('User not found', 400);
        if (possibleUser.type === 'ADMIN') throw new HttpException('Admins don\'t have aditional info ', 400);

        const clientInfo = {
            userId:body.id,
            ...body
        }

        this.clientRepo.save(clientInfo)

        return {
            message: 'Succesfull',
        }
    }
}
