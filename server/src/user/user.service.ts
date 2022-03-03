import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async editUser(
    userId: string,
    dto: EditUserDto,
  ) {
    // find the user by email
    const user = await this.userModel.findOne({ _id: userId });
    // if user does not exist throw exception
    if (!user) throw new NotFoundException('User not found');

    //update User Fields
    user.firstName = dto.firstName || user.firstName;
    user.lastName = dto.lastName || user.lastName;
    user.email = dto.email || user.email;

    user.save();

    return user;
  }
}