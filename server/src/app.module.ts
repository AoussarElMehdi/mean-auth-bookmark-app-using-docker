import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { HttpErrorFilter } from './filter/http-error.filter';
import { MongooseSchemaModule } from './MongooseSchema.module';
import { UserModule } from './user/user.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { KeycloakModule } from './keycloak/keycloak.module';
import { KeycloakService } from './keycloak/keycloak.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookmarkModule,
    MongooseSchemaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
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
    KeycloakModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    KeycloakService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ]
})
export class AppModule { }
