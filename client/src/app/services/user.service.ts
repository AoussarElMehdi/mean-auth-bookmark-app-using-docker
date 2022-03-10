import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../models';
import { environment as env } from 'src/environments/environment';
import { Router } from '@angular/router';

interface SignInForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authEmitter = new EventEmitter<Boolean>();

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
    })
  };

  constructor(private http: HttpClient, private router: Router) { }

  signIn(user: SignInForm) {
    return this.http.post<any>(`${env.BASE_URL}auth/signin`, user);
  }

  signUp(user: User) {
    return this.http.post<any>(`${env.BASE_URL}auth/signup`, user, { observe: 'response' });
  }

  signOut() {
    this.http.post<any>(`${env.BASE_URL}auth/logout`, {
      refreshToken: localStorage.getItem('refreshToken')
    },
      { observe: 'response' })
      .subscribe(
        (res) => {
          localStorage.clear();
          this.authEmitter.emit(false);
          this.router.navigate(['/signin'])
        }
      )
  }

  async refreshToken() {
    await this.http.post<any>(`${env.BASE_URL}auth/refresh`, null, this.httpOptions)
      .subscribe(
        (res) => {
          console.log(res)
          localStorage.clear();
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          localStorage.setItem('expiresIn', res.expiresIn);
          localStorage.setItem('refreshExpiresIn', res.refreshExpiresIn);
          this.authEmitter.emit(true);
        }, (err) => {
          alert(err.message);
          localStorage.clear();
          this.router.navigate(['/signin']);
        });
  }

  public static iSTokenExpires(): boolean {
    if (Number(localStorage.getItem('expiresIn')) < new Date().getTime()) return true
    return false
  }
}
