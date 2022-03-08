import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    JwtModule.register({}),
    ClientsModule.register([
      {
        name: 'BOOKMARK_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'bookmark_client',
            brokers: ['kafka:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      }
    ]),
    KeycloakModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
