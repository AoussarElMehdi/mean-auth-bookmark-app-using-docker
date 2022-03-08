import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeycloakService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly baseUrl: string;
    private readonly keycloakUsername: string;
    private readonly keycloakPassword:string;

    constructor(private readonly config: ConfigService, private readonly http: HttpService) {
        this.clientId = this.config.get('CLIENT_ID');
        this.clientSecret = this.config.get('CLIENT_SECRET_KEY');
        this.baseUrl = this.config.get('KEYCLOAK_BASE_URL');
        this.keycloakUsername = this.config.get('KEYCLOAK_USERNAME');
        this.keycloakPassword = this.config.get('KEYCLOAK_PASSWORD');
    }

    async getAccessToken() {
        try{
            const { data } = await firstValueFrom(
                this.http.post(
                  `${this.baseUrl}/realms/master/protocol/openid-connect/token`,
                  new URLSearchParams({
                    client_id: 'admin-cli',
                    grant_type: 'password',
                    username: this.keycloakUsername,
                    password: this.keycloakPassword,
                  }),
                ),
              );
              return data;
        }catch(err){
            console.log(err);
            return err;
        }
    }
  
}