import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    this.userService.signIn(this.form?.getRawValue()).subscribe((res) => {
      console.log(res)
      if (res.hasOwnProperty('accessToken')) {
        localStorage.setItem('token', res.accessToken);
        this.userService.authEmitter.emit(true);
        this.router.navigate(['/']);
      } else {
        alert(res.message);
      }
    },
    (err) => {
      alert(err.error.message);
  });
  }

}
