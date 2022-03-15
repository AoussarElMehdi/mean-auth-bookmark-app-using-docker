import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/keycloak/decorator/roles.decorator';
import { KeycloakGuard } from 'src/keycloak/guards/keycloak.guard';
import { RolesGuard } from 'src/keycloak/guards/role.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(KeycloakGuard)
@UseGuards(RolesGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Get()
    @Roles(Role.GUEST, Role.ADMIN)
    getBookmarks(@GetUser('sub') userId: string) {
        return this.bookmarkService.getBookmarks(userId);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    getBookmarkById(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string
    ) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    @Post()
    @Roles(Role.ADMIN)
    createBookmark(
        @GetUser('sub') userId: string,
        @Body() dto: CreateBookmarkDto
    ) {
        return this.bookmarkService.createBookmark(userId, dto);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    editBookmark(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string,
        @Body() dto: EditBookmarkDto
    ) {
        return this.bookmarkService.editBookmark(userId, bookmarkId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @Roles(Role.ADMIN)
    deleteBookmark(
        @GetUser('sub') userId: string,
        @Param('id') bookmarkId: string
    ) {
        return this.bookmarkService.deleteBookmark(userId, bookmarkId);
    }
}
