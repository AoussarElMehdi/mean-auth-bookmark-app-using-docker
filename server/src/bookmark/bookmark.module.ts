import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
    imports: [KeycloakModule],
    providers: [BookmarkService],
    controllers: [BookmarkController]
})
export class BookmarkModule {}
