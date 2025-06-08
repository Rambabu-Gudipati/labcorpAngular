import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, Subject, filter } from 'rxjs';
import { AppConstants } from '../app-constants';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders(
    {

      'Content-Type': 'application/json',
    }
  )
};



@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) { }

  get(url: string): Observable<any> {
    return this.http.get(AppConstants.API_BASE_URL + url, httpOptions)
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          return throwError('Something went wrong.');
        })
      );
  }

  getwithAuth(url: string): Observable<any> {
    const authHttpOptions = {
      headers: new HttpHeaders(
        {
          'Authorization': 'Bearer ' + this.authService.getAccessToken(),
          'Content-Type': 'application/json',
        }
      )
    };
    return this.http.get(AppConstants.API_BASE_URL + url, authHttpOptions)
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          return throwError('Something went wrong.');
        })
      );
  }
  getwithAuthWithParams(url: string, params: any): Observable<any> {
    const authHttpOptions = {
      params: params,
      headers: new HttpHeaders(
        {
          'Authorization': 'Bearer ' + this.authService.getAccessToken(),
          'Content-Type': 'application/json',
        }
      )
    };
    return this.http.get(AppConstants.API_BASE_URL + url, authHttpOptions)
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          return throwError('Something went wrong.');
        })
      );
  }

  post(url: string, data: any): Observable<object> {
    return this.http.post(AppConstants.API_BASE_URL + url, data, httpOptions)
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          return throwError(error.error?.message == undefined ? error.error : error.error?.message);
        })
      );
  }

  patchFormData(url: string, data: any): Observable<object> {
    const authHttpOptions = {
      headers: new HttpHeaders(
        {
          'Authorization': 'Bearer ' + this.authService.getAccessToken()
        }
      )
    };
    return this.http.patch(AppConstants.API_BASE_URL + url, data, authHttpOptions)
      .pipe(
        catchError(error => {
          console.log('An error occurred:', error.error);

          return throwError(error.error?.message == undefined ? error.error : error.error?.message);
        })
      );
  }
  postWithAuth(url: string, data: any): Observable<object> {
    const authHttpOptions = {
      headers: new HttpHeaders(
        {
          'Authorization': 'Bearer ' + this.authService.getAccessToken(),
          'Content-Type': 'application/json',
        }
      )
    };
    return this.http.post(AppConstants.API_BASE_URL + url, data, authHttpOptions)
      .pipe(
        catchError(error => {
          console.log('An error occurred:', error.error);

          return throwError(error.error?.message == undefined ? error.error : error.error?.message);
        })
      );
  }


  patch(url: string, data: any): Observable<object> {
    const authHttpOptions = {
      headers: new HttpHeaders(
        {
          'Authorization': 'Bearer ' + this.authService.getAccessToken(),
          'Content-Type': 'application/json',
        }
      )
    };
    return this.http.patch(AppConstants.API_BASE_URL + url, data, authHttpOptions)
      .pipe(
        catchError(error => {
          console.error('An error occurred:', error);
          return throwError(error.error?.message == undefined ? error.error : error.error?.message);
        })
      );
  }
  getData(): Observable<any> {
    return this.http.get('assets/js/data.js');
  }

  private _isInCall = false;
  
  get isInCall(): boolean {
    return this._isInCall;
  }

  set isInCall(value: boolean) {
    this._isInCall = value;
  }

}

