import { Component } from '@angular/core';
import { UserDetailsService } from '../user-details.service';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  passwordForm: FormGroup = new FormGroup({});
  showPassword: boolean = false;


  constructor(
    private fb: FormBuilder,
    private userPasswordService: UserDetailsService,
  ) {
    this.passwordForm = fb.group({
      password: ['', [Validators.required, this.PasswordValidator()]]
    })
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
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
  updatePassword() {
    if (this.passwordForm.valid) {
      const body = this.passwordForm.value; // Assuming this.signupForm.value contains username, password, email
  
      this.userPasswordService.changePassword(body).subscribe(
        (res: any) => {
          if (res.status === true) {
            console.log('Password Updated successfully:', res);
            alert('Password Updated!');
          } else {
            console.log('Please enter a Valid Password', res);
            alert('Not a Valid Password ' + res.message);
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
    return this.passwordForm.controls;
  }

  submit() {
    console.log(this.passwordForm.value);
  }

}
