import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '../cookie.service';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  password: string = ''; // Bound to the password input field via ngModel
  showPassword: boolean = false; // Controls the visibility of the password field
  showPrefix: boolean = false;
  loginForm: FormGroup = new FormGroup({});
  token!: string;
  authToken: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private cookie: CookieService,
    private userLoginService: UserDetailsService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.loginForm = fb.group({
      // mobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      email: ['', [Validators.required, this.validateIdentifier, Validators.email]],
      password: ['', [Validators.required, this.PasswordValidator()]]
    })
  }

  ngOnInit() {
    if (this.cookie.getCookie('access_token')) {
      // to re direct to dashboard/search if the token is not expired
      this.token = this.cookie.getCookie('access_token');
      if (!this.cookie.isTokenExpired(this.token)) {
        this.router.navigate(['/profile']);
      }
    }
    this.activatedRoute?.queryParams.subscribe((res) => {
      if (res['T']) {
        this.cookie.setCookie('access_token', res['T'], 100, '/');
        this.router.navigate(['/profile']);
      }
    });
  }

  PasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;

      // Define your password validation criteria here
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
      const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && value.length >= 8;

      return !isValid ? { invalidPassword: true } : null;
    };
  }

  validateIdentifier(control: any) {
    const mobilePattern = /^\d{10}$/;
    // const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (mobilePattern.test(control.value) || emailPattern.test(control.value)) {
      return null;
    } else {
      return { pattern: true };
    }
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.replace(/\s/g, '');
    const identifier = event.target.value;
    if (/^\d+$/.test(identifier)) {
      this.showPrefix = true;
    } else {
      this.showPrefix = false;
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // userLogin() {
  //   if (this.loginForm.valid) {
  //     this.authService.login(this.loginForm.value).subscribe(
  //       (result) => {
  //         console.log('Login API Response:', result);

  //         if (result && result.status === true) { // Adjust condition to check result.status
  //           console.log('Login successful:', result);
  //           alert(result.message);
  //           this.router.navigate(['/dashboard']);
  //         } else {
  //           console.log('Login unsuccessful:', result);
  //           alert(result.message);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error occurred:', error);
  //         alert('An error occurred. Please try again.');
  //       }
  //     );
  //   }
  // }

  userLogin() {
    let body = this.loginForm.value;
    if (this.loginForm.valid) {
      this.userLoginService.updateUserSignin(body).subscribe(
        (res: any) => {
          if (res.status === true) {
            console.log('Login successful:', res);
            alert(res.message);
            this.router.navigate(['/profile']);
  
            this.cookie.setCookie('access_token', res.data, 100, '/');
            this.authToken = res.data;
            this.router.navigate(['/profile'])
  
          } else {
            console.log('Login unsuccessful:', res);
            alert(res.message);
          }
        },
        (err) => {
          console.log(err);
          alert('An error occurred. Please try again.');
        }
      );
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  submit() {
    console.log(this.loginForm.value);
  }
}
