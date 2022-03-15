import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Role } from './enums/role.enum';
import { Roles } from './keycloak/decorator/roles.decorator';
import { KeycloakGuard } from './keycloak/guards/keycloak.guard';
import { RolesGuard } from './keycloak/guards/role.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(KeycloakGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-test')
  testKafka(){
    return this.appService.testKafka();
  }
}