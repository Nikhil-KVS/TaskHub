import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private cookie: CookieService, private route: Router) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    const tokenVal = this.cookie.getCookie('access_token');
    if (tokenVal) {
      /** set headers before every api call */
      request = request.clone({
        setHeaders: {
          authorization: tokenVal ? `Bearer ${tokenVal}` : '',
        }
      });

    }

    // Pass the cloned request instead of the original request to the next handle
    return next.handle(request).pipe(
      catchError(error => {
        switch (error.status) {
          case 404:
            /* not Found */
            break;
          case 500:
            /* Internal server error */
            break;
          case 504:
            /* Internal server error */
            break;
          case 502:
            /* bad gateWay */
            break;
          case 401:
            /** expired token or unauthorised */
            this.cookie.deleteCookie('access_token');
            // this.route.navigate(['/logout']);
            break;
          default:
            break;
        }
        return throwError(error.error || 'some thing went wrong');
      }),
    );
  }
}
  