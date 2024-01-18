import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetailsService } from '../user-details.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
// import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  tab: any;
  tasks: any;
  id: any;
  addTaskForm: FormGroup = new FormGroup({});
  showPassword: boolean = false; // Controls the visibility of the password field

  constructor(
    private fb: FormBuilder,
    private userTaskService: UserDetailsService,
    private router: ActivatedRoute,
    private route: Router,
    // private notification: NotificationService
  ) {

  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.addTaskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      y: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      FromDate: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      ToDate: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Status: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    }, {
      validators: this.validateDateRange.bind(this)
    });

    this.addTaskForm.get('FromDate')?.valueChanges.subscribe(() => {
      this.addTaskForm.get('ToDate')?.reset();
    });

    this.id ? this.getTaskDetails() : ''
  }

  getTaskDetails() {
    this.userTaskService.getTaskById(this.id).subscribe((res: any) => {
      if (res.status) {
        this.tasks = res.data;
        this.addTaskForm.get('name')?.setValue(res.data.name);
        this.addTaskForm.get('y')?.setValue(res.data.y);
        this.addTaskForm.get('FromDate')?.setValue(res.data.FromDate);
        this.addTaskForm.get('ToDate')?.setValue(res.data.ToDate);
        this.addTaskForm.get('Description')?.setValue(res.data.Description);
        this.addTaskForm.get('Status')?.setValue(res.data.Status);
        console.log(this.tasks)
      }
    }, err => {
      console.log(err)
    })
  }

  createTaskDetails() {
    let body = {
      name: this.addTaskForm.get('name')?.value,
      y: this.addTaskForm.get('y')?.value,
      FromDate: this.addTaskForm.get('FromDate')?.value,
      ToDate: this.addTaskForm.get('ToDate')?.value,
      Description: this.addTaskForm.get('Description')?.value,
      Status: this.addTaskForm.get('Status')?.value,
    }

    this.userTaskService.createTask(body).subscribe((res: any) => {
      if (res.status) {
        console.log(res)
        // this.route.navigate(['/dashboard'])
        // this.notification.info('Changes saved successfully')
        alert('changes saved successfully')
      }
    }, err => {
      console.log(err)
    });
  }

  UpdateTaskDetails() {
    let body = {
      name: this.addTaskForm.get('name')?.value,
      y: this.addTaskForm.get('y')?.value,
      FromDate: this.addTaskForm.get('FromDate')?.value,
      ToDate: this.addTaskForm.get('ToDate')?.value,
      Description: this.addTaskForm.get('Description')?.value,
      Status: this.addTaskForm.get('Status')?.value,
    }

    this.userTaskService.updateTask(body, this.id).subscribe((res: any) => {
      if (res.status) {
        console.log(res)
        // this.route.navigate(['/dashboard'])
        // this.notification.info('changes saved successfully')
        alert('changes saved successfully')
      }
    }, err => {
      console.log(err)
    });
  }

  keyUpEnter(event: any, key: any) {
    let displayName = event.target.value.replace(/\s+/g, ' ').trim();
    event.target.value = displayName
    if (key == 'username') {
      this.addTaskForm.get('name')?.setValue(event?.target?.value);
    } else if (key == 'fromDate') {
      this.addTaskForm.get('FromDate')?.setValue(event?.target?.value);
    } else if (key == 'toDate') {
      this.addTaskForm.get('ToDate')?.setValue(event?.target?.value);
    } else if (key == 'Description') {
      this.addTaskForm.get('Description')?.setValue(event?.target?.value);
    } else if (key == 'Status') {
      this.addTaskForm.get('Status')?.setValue(event?.target?.value);
    }
  }

  validateDateRange(group: FormGroup) {
    const fromDate = group.get('FromDate')?.value;
    const toDate = group.get('ToDate')?.value;

    if (fromDate && toDate && fromDate > toDate) {
      return { invalidDateRange: true };
    }

    return null;
  }

  onKeyPress(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    // Allow only numeric values (0-9)
    return (charCode >= 48 && charCode <= 57);
  }

  get f() {
    return this.addTaskForm.controls;
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit() {
    console.log(this.addTaskForm.value);
  }
}
