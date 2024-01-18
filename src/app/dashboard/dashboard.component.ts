import { AfterViewInit, Component, HostListener, Renderer2 } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { UserDetailsService } from '../user-details.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from '../cookie.service';
import * as jwt_decode from 'jwt-decode';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

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

export interface ChartData {
  name: string;
  y: number;
  Status: string;
}

interface MyUserData {
  _id: any;
  username: string;
  mobileNumber: string;
  email: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements AfterViewInit {
  p: number = 1;
  id: any;
  isMobile: boolean = false;
  tableData: MyData[] = [];
  userData: MyUserData[] = [];
  pieChartData: ChartData[] = [];

  dataPerPage: number = 10;
  tasksCount: number = 0;
  expand: any = -1;
  currentPage = 1;
  status: string = '';
  taskId: any;
  role: any;
  usersCount: number = 0;

  limit = 2;
  totalItems: number = 50;
  totalPages = Math.ceil(this.totalItems / this.limit);

  statuses = ["All", "open", "closed"]
  selectedStatus = ''
  profileForm: FormGroup = new FormGroup({});
  username: any;
  decodedToken: any;

  constructor(
    private renderer: Renderer2,
    private tableService: UserDetailsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userProfileService: UserDetailsService,
    private cookie: CookieService,
  ) {
    this.checkWindowSize();
    const token = this.cookie.getCookie('access_token');
    if (!this.cookie.isTokenExpired(token)) {
      this.decodedToken = jwt_decode.jwtDecode(token);
    }
  }

  ngOnInit(): void {
    this.getAllUsers()
    this.getProfileDetails()
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.getChartData();
    this.getTasks();
  }

  /*
  to get the all users details for admin
  */
  getAllUsers(): void {
    this.userProfileService.allUsers((this.currentPage - 1), this.dataPerPage).subscribe((response: MyUserData[] | any) => {
      if (response.data) {
        this.userData = response.data;
        this.usersCount = response?.count
        this.role = response.role
        // console.log(this.role)
      }
      else {
        console.log('error');
      }
    }, err => {
      console.log(err)
    });
  }

  /*
  to get the profile details of single user
  */
  getProfileDetails() {
    this.userProfileService.getProfileDetails(this.id || this.decodedToken?.user?._id).subscribe((res: any) => {
      if (res.status) {
        this.profileForm.get('username')?.setValue(res.data.username);
        this.username = res.data.username
      }
    }, (err: any) => {
      console.log(err)
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Check window size on resize
    this.checkWindowSize();
  }

  private checkWindowSize() {
    this.isMobile = window.innerWidth < 768; // Defining mobile size

    if (this.isMobile) {
      this.renderer.removeClass(document.body, 'desktop-flex');
    } else {
      this.renderer.addClass(document.body, 'desktop-flex');
    }
  }

  /*
  to get the task details
  */
  getTasks(): void {
    this.tableService.getTask((this.currentPage - 1), this.dataPerPage, this.status, this.id).subscribe((response: MyData[] | any) => {
      if (response.data) {
        this.tableData = response.data;
        this.tasksCount = response?.count
      } else {
        console.error('error');
      }
    }, err => {
      console.log(err)
    });
  }

  /*
  for filtering the task details
  */
  filterButton(selectedValue: string) {
    if (selectedValue == "All")
      this.status = "";
    else
      this.status = selectedValue
    this.getTasks()
  }

  /*
  to get the chart details as highcharts
  */
  getChartData(): void {
    this.tableService.taskDetails(this.id).subscribe((res: any) => {
      if (res.status) {
        this.pieChartData = res.data;
        this.createChartPie();
        this.createChartColumn();
      }
    }, (err: any) => {
      console.log(err)
    });
  }

  public ngAfterViewInit(): void {
    this.createChartPie();
    this.createChartColumn();
  }

  private createChartPie(): void {
    const data = this.pieChartData

    const chart = Highcharts.chart('chart-pie', {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Pie Chart',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: `<span class="mb-2">Task Name: {point.key}</span><br>`,
        pointFormat: '<span>Status: {point.Status}</span>',
        useHTML: true,
      },
      series: [{
        name: null,
        innerSize: '50%',
        data,
      }],
    } as any);
  }

  private createChartColumn(): void {
    const data = this.pieChartData

    const chart = Highcharts.chart('chart-column' as any, {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Column Chart',
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: false,
      },
      yAxis: {
        min: 0,
        title: undefined,
      },
      xAxis: {
        type: 'category',
      },
      tooltip: {
        headerFormat: `<div>Task Name: {point.key}</div>`,
        pointFormat: `<div>{series.name}: {point.y}%</div>`,
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [{
        name: 'Progress',
        data,
      }],
    } as any);
  }

  /*
  updating the task by id
  */
  updateTask(id: any) {
    this.router.navigate(['/add-task/' + id])
  }

  /*
  deleting the task by id
  */
  deleteTask(TaskId: any) {
    this.tableService.deleteById(TaskId).subscribe((res: any) => {
      if (res.status) {
        alert('changes saved successfully')
        this.getTasks()
      }
    }, err => {
      console.log(err)
    });
  }

  onPageChanged(event: number) {
    this.expand = -1;
    this.currentPage = event;
    this.getTasks();
  }
}