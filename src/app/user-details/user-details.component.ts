import { Component } from '@angular/core';
import { UserDetailsService } from '../user-details.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

interface MyData {
  _id: any;
  username: string;
  mobileNumber: string;
  email: string;
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent {
  userData: MyData[] = [];
  dataPerPage: number = 10;
  usersCount: number = 0;
  expand: any = -1;
  currentPage = 1;
  status: string = '';
  role:any;

  constructor(
    private UserDetailsService: UserDetailsService,
    private router: Router,
    private route: ActivatedRoute
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
        console.error('error');
      }
    }, err => {
      console.log(err)
    });
  }

  viewUserProfile(id: any) {
    const queryParams = { direct: true };
    this.router.navigate(['/profile/' + id], { queryParams });
  }

  viewUserTasks(id: any) {
    this.router.navigate(['/dashboard/' + id])
  }

  viewUserTaskDetails(id: any) {
    this.router.navigate(['/task-details/' + id])
  }

  onPageChanged(event: number) {
    this.expand = -1;
    this.currentPage = event;
    this.getAllUsers();
  }
}
