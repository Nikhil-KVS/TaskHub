import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetailsService } from '../user-details.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../notification.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CookieService } from '../cookie.service';
import * as jwt_decode from 'jwt-decode';

interface MyUserData {
  _id: any;
  username: string;
  mobileNumber: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  profileForm: FormGroup = new FormGroup({});
  showPassword: boolean = false; // Controls the visibility of the password field
  id: any;
  decodedToken: any;

  dataPerPage: number = 10;
  tasksCount: number = 0;
  expand: any = -1;
  currentPage = 1;
  userData: MyUserData[] = [];
  role: any;
  usersCount: number = 0;
  username: any;
  Address: any;
  showSubmitButton!: boolean;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserDetailsService,
    private notification: NotificationService,
    private router: ActivatedRoute,
    private cookie: CookieService,
  ) {
    const token = this.cookie.getCookie('access_token');
    if (!this.cookie.isTokenExpired(token)) {
      this.decodedToken = jwt_decode.jwtDecode(token);
    }
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });

    this.profileForm = this.fb.group({
      mobileNumber: ['', [Validators.required, this.validateIdentifier]],
      email: ['', [Validators.required, this.validateIdentifier, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      state: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      Address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      zip: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });

    this.showSubmitButton = this.router.snapshot.queryParams?.['direct'] !== 'true';

    this.getProfileDetails();
    this.getAllUsers()
  }

  getProfileDetails() {
    this.userProfileService.getProfileDetails(this.id || this.decodedToken?.user?._id).subscribe((res: any) => {
      if (res.status) {
        this.profileForm.get('username')?.setValue(res.data.username);
        this.username = res.data.username
        this.profileForm.get('email')?.setValue(res.data.email);
        this.profileForm.get('mobileNumber')?.setValue(res.data.mobileNumber);
        this.profileForm.get('city')?.setValue(res.data.city);
        this.profileForm.get('state')?.setValue(res.data.state);
        this.profileForm.get('zip')?.setValue(res.data.zip);
        this.profileForm.get('Address')?.setValue(res.data.Address);
        this.Address = res.data.Address
        this.profileForm.get('email')?.disable();
      }
    }, (err: any) => {
      console.log(err)
    });
  }

  updateUserDetails() {
    let body = {
      username: this.profileForm.get('username')?.value,
      email: this.profileForm.get('email')?.value,
      mobileNumber: this.profileForm.get('mobileNumber')?.value,
      city: this.profileForm.get('city')?.value,
      state: this.profileForm.get('state')?.value,
      zip: this.profileForm.get('zip')?.value,
      Address: this.profileForm.get('Address')?.value
    }

    this.userProfileService.updateUserProfile(body).subscribe((res: any) => {
      if (res.status) {
        console.log(res)
        // this.notification.info('Changes saved successfully')
        alert(res.message)
      }
    }, err => {
      console.log(err)
    });
  }

  validateIdentifier(control: any) {
    const mobilePattern = /^(0|91)?[6-9][0-9]{9}$/;
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (mobilePattern.test(control.value) || emailPattern.test(control.value)) {
      return null;
    } else {
      return { pattern: true };
    }
  }

  keyUpEnter(event: any, key: any) {
    let displayName = event.target.value.replace(/\s+/g, ' ').trim();
    event.target.value = displayName
    if (key == 'username') {
      this.profileForm.get('username')?.setValue(event?.target?.value);
    } else if (key == 'addRess') {
      this.profileForm.get('address')?.setValue(event?.target?.value);
    } else if (key == 'City') {
      this.profileForm.get('city')?.setValue(event?.target?.value);
    } else if (key == 'State') {
      this.profileForm.get('state')?.setValue(event?.target?.value);
    }
  }

  onKeyPress(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    // Allow only numeric values (0-9)
    return (charCode >= 48 && charCode <= 57);
  }

  get f() {
    return this.profileForm.controls;
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
    }, err => {
      console.log(err)
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit() {
    console.log(this.profileForm.value);
  }
}
