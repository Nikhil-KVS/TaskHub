import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apiurl } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http : HttpClient) { }
  login(data: any):Observable<any>{
    console.log("hello user");
    return this.http.post(`http://localhost:50003/v1/user/signin`,data);
  }

  signUp(data: any):Observable<any>{
    console.log("hello user");
    return this.http.post(`http://localhost:50003/v1/user/signup`,data);
  }
}
