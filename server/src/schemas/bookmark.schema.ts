import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from '.';

export type BookMarkDocument = BookMark & Document;

@Schema({ timestamps: true })
export class BookMark {
  @Prop({ required: true })
  title: string;

  @Prop({ default: null })
  description?: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  user: string;
}

export const BookMarkSchema = SchemaFactory.createForClass(BookMark);