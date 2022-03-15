import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakService } from '../keycloak.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private keycloakService: KeycloakService
    ) { }

    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) return true;

        const request = context.switchToHttp().getRequest();

        const header = request.header('Authorization');

        if (!header) {
            throw new HttpException('Authorization: Bearer <token> header missing', HttpStatus.UNAUTHORIZED);
        }

        const parts = header.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new HttpException('Authorization: Bearer <token> header invalid', HttpStatus.UNAUTHORIZED);
        }

        const token = parts[1];
        try {
            const userRoles = await this.keycloakService.userRoles(token);
            const hasRole = () =>
                userRoles.some((role: string) => !!roles.find(item => item === role));
            if(!hasRole()) throw new UnauthorizedException("unauthorized access");
            return hasRole();
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException("unauthorized access");
        }
    }
}

// export const RoleKeycloakGuard = (role: Role): Type<CanActivate> => {
//     class RoleGuardMixin implements CanActivate {

//         constructor(
//            private keycloakService: KeycloakService,
//         ) { }

//         async canActivate(context: ExecutionContext) {
//             const request = context.switchToHttp().getRequest();

//             const header = request.header('Authorization');
//             if (!header) {
//                 throw new HttpException('Authorization: Bearer <token> header missing', HttpStatus.UNAUTHORIZED);
//             }

//             const parts = header.split(' ');
//             if (parts.length !== 2 || parts[0] !== 'Bearer') {
//                 throw new HttpException('Authorization: Bearer <token> header invalid', HttpStatus.UNAUTHORIZED);
//             }

//             const token = parts[1];
//             try {
//                 console.log(token)
//                 const roles = await this.keycloakService.userRoles(token);
//                 console.log(roles)
//                 return true;
//             } catch (e) {
//                 console.log(e)
//                 throw new UnauthorizedException("unauthorized access");
//             }
//         }
//     }

//     return mixin(RoleGuardMixin);
// }