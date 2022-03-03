import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/schemas';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwt: JwtService
  ) { }

  async signup(dto: AuthDto) {
    try {
      // generate the password hash
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(dto.password, saltOrRounds);
      // save the new user in the db
      const newUser = new this.userModel({
        firstName: dto.firstName || null,
        lastName: dto.lastName || null,
        email: dto.email,
        password: hash
      });

      const user = await newUser.save();

      return this.signToken(String(user._id), user.email);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('email already taken');
      }
      return error;
    }
  }

  async signin(dto: AuthDto) {
    try {
      // find the user by email
      const user = await this.userModel.findOne({ email: dto.email });
      // if user does not exist throw exception
      if (!user) throw new NotFoundException('User not found');
      // compare password
      const isMatch = await bcrypt.compare(dto.password, user.password);
      // if password incorrect throw exception
      if (!isMatch) throw new ForbiddenException('password incorrect');
      // send back the user
      return this.signToken(String(user._id), user.email);
    } catch (error) {
      return error;
    }
  }

  async signToken(userId: string, email: string): Promise<{accessToken: string}> {
    const payload = {sub: userId, email};
    
    const token = await this.jwt.signAsync(payload,{
      expiresIn: '15m',
      secret: process.env.JWT_SECRET
    })

    return {
      accessToken: token
    }
  }
}
