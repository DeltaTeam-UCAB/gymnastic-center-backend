import { SetMetadata } from '@nestjs/common'
import { User } from '../../../user/infraestructure/models/postgres/user.entity'
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { UserType } from 'src/user/application/models/user'

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles)

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<UserType[]>(
            'roles',
            context.getHandler(),
        )
        if (!roles || roles.isEmpty()) return true
        const request = context.switchToHttp().getRequest()
        if (!request.user) throw new UnauthorizedException()
        const user = request.user as User
        return roles.some((e) => e === user.type)
    }
}
