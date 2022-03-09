import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, lastValueFrom, map, tap } from 'rxjs';
import { SignInDto, SignUpDto } from 'src/auth/dto';
import * as queryString from 'querystring';
import { KeycloakToken } from 'src/models';

type credential = {
    type: string,
    value: string,
    temporary: boolean
}

type userRepresentation = {
    firstName: string,
    lastName: string,
    email: string,
    enabled: boolean,
    username: string,
    credentials: credential[]
}

export interface KeycloakUserInfoResponse {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string,
    email: string;
}

@Injectable()
export class KeycloakService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly baseUrl: string;
    private readonly keycloakUsername: string;
    private readonly keycloakPassword: string;
    private readonly realm: string;
    private readonly signinUri: string;
    private readonly keycloakResponseType: string;
    private readonly keycloakScope: string;
    private readonly keycloakRedirectUri: string;

    constructor(private readonly config: ConfigService, private readonly http: HttpService) {
        this.clientId = this.config.get('CLIENT_ID');
        this.clientSecret = this.config.get('CLIENT_SECRET_KEY');
        this.baseUrl = this.config.get('KEYCLOAK_BASE_URL');
        this.keycloakUsername = this.config.get('KEYCLOAK_USERNAME');
        this.keycloakPassword = this.config.get('KEYCLOAK_PASSWORD');
        this.realm = this.config.get('KEYCLOAK_REALM');
        this.keycloakResponseType = this.config.get('KEYCLOAK_RESPONSE_TYPE');
        this.keycloakScope = this.config.get('KEYCLOAK_SCOPE');
        this.keycloakRedirectUri = this.config.get('KEYCLOAK_REDIRECT_URI');
    }

    async getAccessToken() {
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
    }

    async signup(dto: SignUpDto, accessToken: string) {
        // create a representation of the user
        const userInfo: userRepresentation = {
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            enabled: true,
            username: dto.username,
            credentials: [
                {
                    type: 'password',
                    value: dto.password,
                    temporary: false
                }
            ]
        }
        // setup the header authorization
        const config = { headers: { Authorization: `Bearer ${accessToken}` } }
        // send data to the keycloak server to create the user
        const { data } = await firstValueFrom(
            this.http.post(
                `${this.baseUrl}/admin/realms/${this.realm}/users`,
                userInfo,
                config
            ),
        );
        return data;
    }

    async signin(dto: SignInDto) {
        const data = await firstValueFrom(
            this.http.post(
                `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
                new URLSearchParams({
                    username: dto.username,
                    password: dto.password,
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: "password",
                }),
                { headers: { 'Content-Type' : 'application/x-www-form-urlencoded'} }
            ).pipe(
                map((response) => {
                    return new KeycloakToken(
                        response.data.access_token,
                        response.data.refresh_token,
                        response.data.expires_in,
                        response.data.refresh_expires_in
                    )
                }),
            ),
        );
        return data;
        // return this.http.post(
        //     `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        //     new URLSearchParams({
        //         client_id: this.clientId,
        //         client_secret: this.clientSecret,
        //         grant_type: this.grantType,
        //         username: dto.username,
        //         password: dto.password
        //     }),
        // ).pipe(
        //     tap((resp) => console.log(resp.data)),
        //     map(res => res.data)
        // )
    }

    async authenticate(accessToken: string): Promise<KeycloakUserInfoResponse> {
        // setup the header authorization
        const config = { headers: { Authorization: `Bearer ${accessToken}` } }
        // get user info from access token
        const data = await firstValueFrom(
            this.http.get(
                `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`,
                config
            ).pipe(
                map((response) => response.data),
            ),
        );
        return data;
    }

}