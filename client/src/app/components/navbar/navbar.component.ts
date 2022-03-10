import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: Boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if(!(localStorage.getItem('accessToken'))) {
      this.router.navigate(['/signin']);
    }else {
      this.isLoggedIn = true;
    }

    this.userService.authEmitter.subscribe(
      (auth: boolean) => {
        this.isLoggedIn = auth;
        if(!this.isLoggedIn || !(localStorage.getItem('accessToken'))){
          this.router.navigate(['/signin']);
        }
      }
    )
  }

  signOut() {
    this.userService.signOut();
    this.isLoggedIn = false;
  }

}
