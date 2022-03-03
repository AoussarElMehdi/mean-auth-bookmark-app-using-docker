import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';

@Module({
    imports: [],
    providers: [BookmarkService],
    controllers: [BookmarkController]
})
export class BookmarkModule {}
