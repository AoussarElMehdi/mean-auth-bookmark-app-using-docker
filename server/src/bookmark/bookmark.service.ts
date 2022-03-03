import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookMark, BookMarkDocument } from 'src/schemas';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(
        @InjectModel(BookMark.name) private readonly bookMarkModel: Model<BookMarkDocument>
    ) {}

    getBookmarks(userId: string) { 
        return this.bookMarkModel.find({ user: userId });
     }

    async getBookmarkById(userId: string, bookmarkId: string) {
        try{
            const bookMark = await this.bookMarkModel.findOne({ user: userId, _id: bookmarkId });

            if (!bookMark) throw new NotFoundException('BookMark not found');

            return bookMark;
        }catch(e){
            return e;
        }
    }

    async createBookmark(userId: string, dto: CreateBookmarkDto) { 
        const newBookmark = new this.bookMarkModel({ 
            user: userId,
            ...dto
        });

        const bookmark = await newBookmark.save();

        return bookmark;
    }

    async editBookmark(userId: string, bookmarkId: string, dto: EditBookmarkDto) {
        const bookMark = await this.bookMarkModel.findOne({ user: userId, _id: bookmarkId });
        if (!bookMark) throw new NotFoundException('BookMark not found');

        bookMark.title = dto.title || bookMark.title;
        bookMark.link = dto.link || bookMark.link;
        bookMark.description = dto.description || bookMark.description;

        bookMark.save();

        return bookMark;
    }

    async deleteBookmark(userId: string, bookmarkId: string) {
        const bookMark = await this.bookMarkModel.findOne({ user: userId, _id: bookmarkId });
        if (!bookMark) throw new NotFoundException('BookMark not found');

        bookMark.deleteOne({ _id: bookmarkId });
    }
}
