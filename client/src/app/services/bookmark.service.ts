import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookMark } from '../models';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.getAccessTokenFromLocalStorage()}`
     })
  };

  getAccessTokenFromLocalStorage(){
    const token = localStorage.getItem('accessToken');
    return token;
  }

  getBookMarks() {
    return this.http.get<any>( `${env.BASE_URL}bookmarks`, this.httpOptions);
  }

  getBookMarkById(id: string){
    return this.http.get<any>( `${env.BASE_URL}bookmarks/${id}`, this.httpOptions);
  }

  insertBookMark(bookmark: BookMark){
    return this.http.post<any>( `${env.BASE_URL}bookmarks`, bookmark, this.httpOptions);
  }

  updateBookMark(bookmark: BookMark){
    return this.http.patch<any>( `${env.BASE_URL}bookmarks/${bookmark._id}`, bookmark, this.httpOptions);
  }

  deleteBookMark(id: string){
    return this.http.delete<any>( `${env.BASE_URL}bookmarks/${id}`, this.httpOptions);
  }

}
