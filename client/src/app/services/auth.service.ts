import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UtilsServiceService } from './util-service';
import { AppConstants } from '../app-constants';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // loginUSer(loginUserData: any)
  // {
  //   throw new Error('Method not implemented.');
  // }
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  api_url = AppConstants.API_BASE_URL;
  isAuthenticated = false;

  currentUserValue(): User {
    var user_data = this.util.decrypt_Text(localStorage.getItem('user_data'));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user_data || '{}'));

    return this.currentUserSubject.value;
  }


  constructor(private httpClient: HttpClient, public router: Router, public util: UtilsServiceService) {
    var user_data = this.util.decrypt_Text(localStorage.getItem('user_data'));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(user_data || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  login(data: any) {
    return this.httpClient.post<any>(this.api_url + AppConstants.LOGIN, data)
  }

  activateAccount(username: any, token: any, password: any) {
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
  }
  getAccessToken() {
    var access_token = this.util.decrypt_Text(localStorage.getItem('access_token'));
    return access_token;
  }
  getUserId() {
    var uid = this.util.decrypt_Text(localStorage.getItem('user_id'));
    return uid;//encodeURIComponent(uid);
  }
  getUserName() {
    var userInfo = this.getUserInfo();
    return this.util.decrypt_Text(localStorage.getItem('user_data'));

  }
  getUserInfo() {
    var userObj = this.util.decrypt_Text(localStorage.getItem('user_data'));
    var userInfo = JSON.parse(JSON.stringify(userObj));
    return userInfo;

  }
  checkAuthentication(): boolean {
    const currentUser = this.getUserName();
    if (currentUser == null || currentUser == undefined || currentUser == '') {

      return false;
    }
    return true;
  }
  logout() {
    localStorage.clear();
     this.router.navigate(['/login']);
    if (localStorage.removeItem('access_token') == null) {

    }
  }
  public isAuthorized(allowedRoles: string[]): boolean {
    var user = this.currentUserValue();
    if (!user) return false;
    var allowed = allowedRoles.includes(user.role);
    return allowed;
  }
}











