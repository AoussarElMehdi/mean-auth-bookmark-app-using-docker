import { BadRequestException, ForbiddenException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from 'src/schemas';
import { ClientKafka } from '@nestjs/microservices';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private keycloakAccessToken: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly baseUrl: string;
  private readonly realm: string;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject('BOOKMARK_SERVICE') private readonly client: ClientKafka,
    private readonly keycloakService: KeycloakService,
    private jwt: JwtService,
    private readonly config: ConfigService,
    private readonly http: HttpService
  ) {
    this.clientId = this.config.get('CLIENT_ID');
    this.clientSecret = this.config.get('CLIENT_SECRET_KEY');
    this.baseUrl = this.config.get('KEYCLOAK_BASE_URL');
    this.realm = this.config.get('KEYCLOAK_REALM');
  }

  async signup(dto: SignUpDto) {
    try {
      // generate the admin token
      const { access_token } = await this.keycloakService.getAccessToken()
      // create the user
      const data = await this.keycloakService.signup(dto, access_token);
      // produce message while user sign up
      // this.client.emit(
      //   'USER-SIGN-UP',
      //   {
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     email: user.email
      //   }
      // ).subscribe(
      //   result => console.log(result),
      //   err => { 
      //     console.log(err)
      //     throw new Error('produce message error')
      //   }
      // )
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('email already taken');
      }
      return error;
    }
  }

   async signin(dto: SignInDto) {
    try {
      const data = await this.keycloakService.signin(dto);
      return data;

      // produce message while user sign in
      // this.client.emit(
      //   'USER-SIGN-IN',
      //   {
      //     firstName: user.firstName,
      //     lastName: user.lastName,
      //     email: user.email
      //   }
      // ).subscribe(
      //   result => console.log(result),
      //   err => {
      //     console.log(err)
      //     throw new Error('produce message error')
      //   }
      // )
    } catch (error) {
      return error;
    }
  }

  async signToken(userId: string, email: string): Promise<{ accessToken: string }> {
    const payload = { sub: userId, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET
    })

    return {
      accessToken: token
    }
  }

}
