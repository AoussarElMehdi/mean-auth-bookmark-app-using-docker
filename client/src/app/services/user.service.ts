import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models';
import { environment as env } from 'src/environments/environment';

interface SignInForm{
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authEmitter = new EventEmitter<Boolean>();

  constructor(private http: HttpClient) {}

  signIn(user: SignInForm) {
    return this.http.post<any>(`${env.BASE_URL}auth/signin`, user);
  }

  signUp(user: User) {
    return this.http.post<any>(`${env.BASE_URL}auth/signup`, user);
  }

  signOut() {
    localStorage.removeItem('token');
    this.authEmitter.emit(false);
  }
}
