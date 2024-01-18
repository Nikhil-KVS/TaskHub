import { Component } from '@angular/core';
import { UserDetailsService } from '../user-details.service';

interface MyData {
  _id: any;
  username: string;
  mobileNumber: string;
  email: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  selectedOption:any;
  responseData: any;
  role:any;
  userData: MyData[] = [];
  usersCount: number = 0;
  dataPerPage: number = 10;
  currentPage = 1;

  constructor(
    private UserDetailsService: UserDetailsService,
  ) {
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  selectOption(option: number) {
    this.selectedOption = option;
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
}
