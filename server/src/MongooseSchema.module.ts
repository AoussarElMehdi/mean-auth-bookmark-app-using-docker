import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookMark, BookMarkSchema, User, UserSchema } from './schemas';

@Global()
@Module({
    imports: [MongooseModule.forFeature(
        [
          { name: User.name, schema: UserSchema },
          { name: BookMark.name, schema: BookMarkSchema }
        ]
      )],
    exports: [MongooseModule]
})
export class MongooseSchemaModule {};