import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { KeycloakGuard } from 'src/keycloak/keycloak.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(KeycloakGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    getBookmarks(@GetUser('sub') userId: string) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string
    ) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    createBookmark(
        @GetUser('sub') userId: string,
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    @Patch(':id')
    editBookmark(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string,
        @Body() dto: EditBookmarkDto
    ) {
        return this.bookmarkService.editBookmark(userId, bookmarkId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmark(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string
    ) {
        return this.bookmarkService.deleteBookmark(userId, bookmarkId);
    }
}
