import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { TaskDetailsComponent } from './task-details/task-details.component';


const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'signup', component: SignupComponent },

  { path: 'profile', component: ProfileComponent },

  { path: 'profile/:id', component: ProfileComponent },

  { path: 'dashboard', component: DashboardComponent },

  { path: 'dashboard/:id', component: DashboardComponent },
  
  { path: 'change-password', component: ChangePasswordComponent },

  { path: 'add-task/:id', component: AddTaskComponent },

  { path: 'add-task', component: AddTaskComponent },

  { path: 'user-details', component: UserDetailsComponent },

  { path: 'task-details', component: TaskDetailsComponent },

  { path: 'task-details/:id', component: TaskDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
