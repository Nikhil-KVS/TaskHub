import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiurlService {

  constructor() { }
}


export const domain = environment.apiUrl;

export const Apiurl = {
  login: `${domain}/user`,
  profile: `${domain}/profile`,
  settings: `${domain}/settings`,
  tasks: `${domain}/tasks`,
  chart: `${domain}/chart`,
  users: `${domain}/users`,
};