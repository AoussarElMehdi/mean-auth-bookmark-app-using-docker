import { Module } from '@nestjs/common';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [KeycloakModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
