import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookMark } from 'src/app/models';
import { BookmarkService, UserService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean = false;
  bookMarks: BookMark[];
  saveAction: boolean = true;
  form: FormGroup;
  submitted = false;
  selectedBook: string = '';

  constructor(
    private userService: UserService,
    private bookmarkService: BookmarkService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(!(localStorage.getItem('accessToken'))) {
      this.router.navigate(['/signin']);
    }else {
      this.isLoggedIn = true;
    }

    this.form = this.formBuilder.group({
      _id: '',
      title: ['', [Validators.required]],
      link: ['', [Validators.required]],
      description: ''
    });

    this.userService.authEmitter.subscribe(
      (auth: boolean) => {
        this.isLoggedIn = auth;
        if (!this.isLoggedIn || !(localStorage.getItem('accessToken'))) {
          this.router.navigate(['/signin']);
        }
      }
    )

    this.fetchBookmarks()
  }
  get f() { return this.form.controls; }

  fetchBookmarks() {
    if(UserService.iSTokenExpires()) this.userService.refreshToken()
    this.bookmarkService.getBookMarks().subscribe(
      (res) => {
        this.bookMarks = res as BookMark[];
      }
    )
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
    this.saveAction = true;
  }

  update(bookmark: BookMark) {
    this.saveAction = false;
    this.form.controls['_id'].setValue(bookmark._id);
    this.form.controls['title'].setValue(bookmark.title);
    this.form.controls['link'].setValue(bookmark.link);
    this.form.controls['description'].setValue(bookmark.description);
  }

  delete(id: string) {
    this.selectedBook = id;
  }

  confirmDelete() {
    if(UserService.iSTokenExpires()) this.userService.refreshToken()
    this.bookmarkService.deleteBookMark(this.selectedBook).subscribe(
      (res) => {
        if (res && res.hasOwnProperty('statusCode') && res.statusCode === 401) {
          alert(res.message);
        } else {
          alert('bookMark deleted')
          this.fetchBookmarks();
        }
      }
    )
    this.fetchBookmarks();
    this.selectedBook = '';
  }

  saveOrUpdate() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    if(UserService.iSTokenExpires()) this.userService.refreshToken()
    if (this.saveAction) {
      this.bookmarkService.insertBookMark(this.form?.getRawValue()).subscribe(
        (res) => {
          if (res.hasOwnProperty('statusCode') && res.statusCode === 401) {
            alert(res.message);
          } else {
            alert('bookMark Inserted')
            this.fetchBookmarks();
          }
        }
      )
    } else {
      this.bookmarkService.updateBookMark(this.form?.getRawValue()).subscribe(
        (res) => {
          if (res.hasOwnProperty('statusCode') && res.statusCode === 401) {
            alert(res.message);
          } else {
            alert('bookMark updated')
            this.fetchBookmarks();
          }
        }
      )
    }

    this.submitted = false;
    this.form.reset();
    this.saveAction = true;
  }

}
