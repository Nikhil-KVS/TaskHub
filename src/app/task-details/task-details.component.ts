import { Component } from '@angular/core';
import { CookieService } from '../cookie.service';
import { UserDetailsService } from '../user-details.service';
import * as jwt_decode from 'jwt-decode';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

interface MyData {
  id: any;
  user_id: any;
  _id: any;
  name: string;
  FromDate: string;
  ToDate: string;
  Description: string;
  Status: string;
  y: number;
}

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent {
  statuses = ["All", "open", "closed"]
  selectedStatus = ''
  p: number = 1;
  id: any;
  isMobile: boolean = false;
  tableData: MyData[] = [];
  dataPerPage: number = 10;
  tasksCount: number = 0;
  expand: any = -1;
  currentPage = 1;
  status: string = '';
  taskId:any;
  role:any;
  usersCount: number = 0;
  decodedToken: any;

  constructor(
    private tableService: UserDetailsService,
    private cookie: CookieService,
    private router:Router,
    private route : ActivatedRoute
  ) {
    const token = this.cookie.getCookie('access_token');
    if (!this.cookie.isTokenExpired(token)) {
      this.decodedToken = jwt_decode.jwtDecode(token);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getTasks();
  }

  getTasks(): void {
    this.tableService.getTask((this.currentPage - 1), this.dataPerPage, this.status, this.id).subscribe((response: MyData[] | any) => {
      if (response.data) {
        this.tableData = response.data;
        this.tasksCount = response?.count
      } else {
        console.error('error');
      }
    },err=>{
      console.log(err)
    });
  }

  filterButton(selectedValue: string) {
    if (selectedValue == "All")
      this.status = "";
    else
      this.status = selectedValue
    this.getTasks()
  }

  updateTask(id: any) {
    this.router.navigate(['/add-task/' + id])
  }

  deleteTask(TaskId:any) {
    this.tableService.deleteById(TaskId).subscribe((res: any) => {
      if (res.status) {
        console.log(res)
        alert('changes saved successfully')
        this.getTasks()
      }
    }, err => {
      console.log(err)
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.getTasks();
  }

  onPageChanged(event: number) {
    this.expand = -1;
    this.currentPage = event;
    this.getTasks();
  }

}
