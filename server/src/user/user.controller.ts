import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/schemas';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { KeycloakGuard } from 'src/keycloak/guards/keycloak.guard';

@UseGuards(KeycloakGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('me')
    getMe(@GetUser() user: User) {
        return user;
    }

    @Patch()
    editUser(
        @GetUser('sub') userId: string,
        @Body() dto: EditUserDto,
    ) {
        return this.userService.editUser(userId, dto);
    }
}
