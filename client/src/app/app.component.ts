import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from '../enviroments/enviroment';
import { HttpClientService } from './services/http-client-service';
import { AppConstants } from './app-constants';
import { EventService } from './services/event.service';
import { JoinScreenComponent } from './modules/video-module/components/join-screen/join-screen.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'af-notification';
  userId: any;
  message: any = null;
  fcmCode: string = '';
  backgroundImage: string = "url('../../../../assets/img/login-bg.jpg')"
  constructor(
    public authService: AuthService,
    public router: Router, private eventService: EventService,private modalService: NgbModal,
    private httpService: HttpClientService,private auth:AuthService,
  ) {
  }
  ngOnInit(): void {

  //  this.passingFcmToken();

    this.eventService.loginEvent.subscribe(() => this.onLogin());
    this.userId = this.authService.getUserInfo();
    this.requestPermission();
    this.listen();
  }
  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging,
      { vapidKey: environment.firebaseConfig.vapidKey }).then(
        (currentToken) => {
          if (currentToken) {
            var data = { 'fcm_token': currentToken, 'device_type': 'Web' }
            this.httpService.postWithAuth(AppConstants.UPDATE_FCM_TOKEN, data)
              .subscribe(x => {

                console.log(x);
              });
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      var userInfo =JSON.parse(this.auth.getUserInfo());
      
      var roles=userInfo.role;
    if(roles !== 'Care Team')
    {
      return;
    }
     
      // this.router.navigateByUrl('video/join-call', { state: { sos_data: JSON.stringify(payload) } });
      // this.message = payload;
      // var sos_data = JSON.parse(JSON.stringify(payload));
      // console.log(sos_data);

      var sos = JSON.parse(JSON.stringify(payload));
      var sos_data = JSON.parse(sos.data.sos_info);

 const modalRef = this.modalService.open(JoinScreenComponent, { centered: true, size: 'lg' });
  modalRef.componentInstance.meeting_token = sos_data.sos_room_token;
  modalRef.componentInstance.room_id = sos_data.room_id;
  modalRef.componentInstance.sos_id = sos_data.sos_id;
  modalRef.componentInstance.sosData = sos_data;
  modalRef.result.then((result) => {
    console.log(result);
    //this.loadDoctors(this.page,this.limit);
  }).catch((error) => {
    console.log(error);
    //this.loadDoctors(this.page,this.limit);
  });

    });

  }
  onLogin() {
    console.log('Login event fired in AppComponent!');
    this.backgroundImage = '';
    this.userId = this.authService.getUserInfo();
    // Perform additional actions here
  }

  passingFcmToken()
  {
    this.router.navigate(['./header.component.html'], { queryParams: { fcm_token: this.fcmCode } });
  }
  // private getDeviceToken(): void {
  //   getToken(this._messaging, { vapidKey: environment.firebaseConfig.vapidKey })
  //     .then((token) => {
  //       console.log(token);
  //       // save the token in the server, or do whathever you want
  //     })
  //     .catch((error) => console.log('Token error', error));
  // }

  // private onMessage(): void {
  //   onMessage(this._messaging, {
  //     next: (payload) => console.log('Message', payload),
  //     error: (error) => console.log('Message error', error),
  //     complete: () => console.log('Done listening to messages'),
  //   });
  // }


  // ngOnInit() {
  //   //this.requestPermission();
  //   //this.listen();
  //   if ('serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('firebase-messaging-sw.js')
  //       .then((register) => {
  //         this.requestPermission();
  //         this.listen();
  //       })
  //   } else {
  //     console.log('Service Worker not supported')
  //   }
  //   this.router.events.subscribe((evt) => {
  //     if (!(evt instanceof NavigationEnd)) {
  //       return;
  //     }
  //     window.scrollTo(0, 0);
  //   });
  //   // const currentUser = this.authService.currentUserValue;
  //   // if (currentUser == null || currentUser.email == undefined) {
  //   //   this.router.navigate(['/login'])
  //   // }else{
  //   //  // this.router.navigate(['/dashboard'])
  //   // }
  // }

  // requestPermission() {
  //   messaging.getToken({ vapidKey: environment.firebaseConfig.vapidKey })
  //     .then((currentToken) => {
  //       if (currentToken) {
  //         console.log(currentToken);
  //       } else {
  //         console.log('No registration token available. Request permission to generate one.');
  //       }
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  // }

  // listen() {


  //   messaging.onMessage(function (payload) {
  //     console.log('[firebase-messaging-sw.js] Received background message ', payload);
  //     // Customize notification here
  //     const notificationTitle = 'Background Message Title';
  //     const notificationOptions = {
  //       body: 'Background Message body.',
  //       icon: '/firebase-logo.png'
  //     };


  //   });

  // }


}
