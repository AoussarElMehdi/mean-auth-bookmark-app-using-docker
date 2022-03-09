export class KeycloakToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
    refreshExpiresIn: string;

    constructor (access_token: string, refresh_token: string, expires_in: string, refresh_expires_in: string) {
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        this.expiresIn = expires_in;
        this.refreshExpiresIn = refresh_expires_in;
    }
}