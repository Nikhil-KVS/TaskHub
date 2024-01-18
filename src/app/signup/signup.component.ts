import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthServiceService } from '../auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from '../cookie.service';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({});
  showPassword: boolean = false; // Controls the visibility of the password field
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
    this.signupForm = fb.group({
      mobileNumber: ['', [Validators.required, this.validateIdentifier]],
      email: ['', [Validators.required, this.validateIdentifier, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, this.PasswordValidator()]]
    })
  }

  ngOnInit() {
    if (this.cookie.getCookie('access_token')) {
      // to re direct to dashboard/search if the token is not expired
      this.token = this.cookie.getCookie('access_token');
      if (!this.cookie.isTokenExpired(this.token)) {
        // this.router.navigate(['/dashboard']);
      }
    }
    this.activatedRoute?.queryParams.subscribe((res) => {
      if (res['T']) {
        this.cookie.setCookie('access_token', res['T'], 100, '/');
        // this.router.navigate(['/dashboard']);
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

  keyUpEnter(event: any, key: any) {
    let displayName = event.target.value.replace(/\s+/g, ' ').trim();
    event.target.value = displayName
    if (key == 'username') {
      this.signupForm.get('username')?.setValue(event?.target?.value);
    }
  }

  onKeyPress(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    // Allow only numeric values (0-9)
    return (charCode >= 48 && charCode <= 57);
  }

  // userSignup() {
  //   if (this.signupForm.valid) {
  //     this.authService.signUp(this.signupForm.value).subscribe(
  //       (result) => {
  //         console.log('Signup API Response:', result);

  //         if (result.status) {
  //           console.log('Signup successful:', result);
  //           alert(result.message);
  //           // Optionally navigate to a success page or redirect to login after successful signup
  //         } else {
  //           console.log('Signup unsuccessful:', result);
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

  userSignup() {
    if (this.signupForm.valid) {
      const body = this.signupForm.value; // Assuming this.signupForm.value contains username, password, email
  
      this.userLoginService.updateUserSignup(body).subscribe(
        (res: any) => {
          if (res.status === true) {
            console.log('Signup successful:', res);
            alert('Signup successful!');
            this.router.navigate(['']);
  
            // Set the access_token in a cookie or your preferred storage method
            // this.cookie.setCookie('access_token', res.data, 100, '/');
            // this.authToken = res.data;
          } else {
            console.log('Signup unsuccessful:', res);
            alert('Signup unsuccessful: ' + res.message);
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
    return this.signupForm.controls;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit() {
    console.log(this.signupForm.value);
  }
}
