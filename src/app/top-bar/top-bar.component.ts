import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '../cookie.service';
import { UserDetailsService } from '../user-details.service';

interface MyData {
  _id: any;
  username: string;
  mobileNumber: string;
  email: string;
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  selectedOption: any;
  responseData: any;
  role: any;
  userData: MyData[] = [];
  usersCount: number = 0;
  dataPerPage: number = 5;
  currentPage = 1;
  constructor(
    private router: Router,
    private cookie: CookieService,
    private UserDetailsService: UserDetailsService,
  ) {

  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.UserDetailsService.allUsers((this.currentPage - 1), this.dataPerPage).subscribe((response: MyData[] | any) => {
      if (response.data) {
        this.userData = response.data;
        this.usersCount = response?.count
        this.role = response.role
        // console.log(this.role)
      } else {
        console.log('error');
      }
    }, err => {
      console.log(err)
    });
  }

  logout() {
    this.cookie.deleteCookie('access_token');
    this.router.navigate(['']);
  }
}
