import { Body, Controller, Headers, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { HttpErrorFilter } from 'src/filter/http-error.filter';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

// @UseFilters(new HttpErrorFilter())
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private keycloakService: KeycloakService
    ) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Headers('Authorization') header: string) {
    return this.keycloakService.refreshToken(header);
  }

  @Post('logout')
    @HttpCode(204)
    logout(@Body() body: {refreshToken: string}){
        return this.keycloakService.logout(body.refreshToken);
    }
}
