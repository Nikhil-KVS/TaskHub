import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }
  getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }

  setCookie(name: string, value: string, expireDays: number, path: string = '') {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  deleteAllCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      this.deleteCookie(name);
    }
  }


  isTokenExpired(token?: string): boolean {
    if (!token) { return true; }
    const date = this.getTokenExpirationDate(token);
    if (date === null) { return false; }
    else {
      return !(date.valueOf() > new Date().valueOf());
    }
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp !== undefined) {
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }
    else { return null; }
  }
}
