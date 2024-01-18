import { Injectable } from '@angular/core';
import { Apiurl } from './apiurl.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor(private http: HttpClient) { }

  updateUserSignin (body: any) {
    return this.http.post(`${Apiurl.login}/signin`, body)
  }

  updateUserSignup (body: any) {
    return this.http.post(`${Apiurl.login}/signup`, body)
  }

  updateUserProfile(body: any) {
    return this.http.put(`${Apiurl.profile}/save`, body)
  }

  getProfileDetails(taskId:any) {
    return this.http.get(`${Apiurl.profile}/details/${taskId}`)
  }

  changePassword(body: any) {
    return this.http.put(`${Apiurl.settings}/save`, body)
  }

  createTask (body: any) {
    return this.http.post(`${Apiurl.tasks}/saveTask`, body)
  }

  updateTask (body: any, taskId: any) {
    return this.http.put(`${Apiurl.tasks}/updateTask/${taskId}`, body)
  }

  getTask (currentPage: number = 0, dataPerPage: number = 2, status: string = '', taskId:any) {
    const params = {'offset': currentPage, 'limit': dataPerPage, 'status': status, 'taskId':taskId}
    return this.http.get(`${Apiurl.tasks}/taskDetails`,{params})
  }

  taskDetails (taskId:any) {
    const params = {'taskId':taskId}
    return this.http.get(`${Apiurl.chart}/chartdetails`,{params})
  }

  allUsers (currentPage: number = 0, dataPerPage: number = 2, status: string = '') {
    const params = {'offset': currentPage, 'limit': dataPerPage}
    return this.http.get(`${Apiurl.users}/allUserDetails`,{params})
  }

  getTaskById (taskId: any) {
    // { params: { taskId: taskId } }
    return this.http.get(`${Apiurl.tasks}/detailsById/${taskId}` )
  }

  deleteById (taskId: any) {
    // { params: { taskId: taskId } }
    return this.http.delete(`${Apiurl.tasks}/deleteById/${taskId}` )
  }
}
