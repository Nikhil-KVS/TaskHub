import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastService: ToastrService) { }

  success(message: any) {
    // this.toastService.success('', message, { closeButton: true, timeOut: 5000, extendedTimeOut: 0, tapToDismiss: false });
    this.toastService.success(message,'',
      {
        positionClass: 'toast-top-right', // Override global position for this toast
        enableHtml: true, // Enable HTML in the message
        timeOut: 100000, // Set the timeout (in milliseconds)
        closeButton: true, // Show a close button
      }
    );
  }

  error(message: any) {
    this.toastService.error('', message, { closeButton: true, timeOut: 5000, extendedTimeOut: 0, tapToDismiss: false });
  }

  warning(message: any) {
    // this.toastService.warning('', message, { closeButton: true, timeOut: 5000, extendedTimeOut: 0, tapToDismiss: false });
    this.toastService.warning(message,'',
      {
        positionClass: 'toast-top-right', // Override global position for this toast
        enableHtml: true, // Enable HTML in the message
        timeOut: 2000, // Set the timeout (in milliseconds)
        closeButton: false, // Show a close button
      }
    );
  }

  info(message: any) {
    this.toastService.info('', message, { positionClass: 'toast-top-right', closeButton: true, timeOut: 5000, extendedTimeOut: 0, tapToDismiss: false });
  }

  mobileSuccess(message: any) {
    this.toastService.success(message,'',
      {
        positionClass: 'toast-bottom-center', // Override global position for this toast
        enableHtml: true, // Enable HTML in the message
        timeOut: 2000, // Set the timeout (in milliseconds)
        closeButton: false, // Show a close button
      }
    );
  }

  mobileWarning(message: any) {
    this.toastService.warning(message,'',
      {
        positionClass: 'toast-bottom-center', // Override global position for this toast
        enableHtml: true, // Enable HTML in the message
        timeOut: 2000, // Set the timeout (in milliseconds)
        closeButton: false, // Show a close button
      }
    );
  }
}
