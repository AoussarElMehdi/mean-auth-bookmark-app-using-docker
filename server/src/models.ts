export class KeycloakToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;

    constructor (access_token: string, refresh_token: string, expires_in: number, refresh_expires_in: number) {
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        this.expiresIn = new Date().getTime() + expires_in * 1000;
        this.refreshExpiresIn = new Date().getTime() + refresh_expires_in * 1000;
    }
}