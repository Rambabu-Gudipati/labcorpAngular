import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true
})
export class HeaderComponent implements OnInit {
  userProfile: any
  profileUrl: String = '';
  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const fcmCode = params['fcm_token'];
      console.log('FCM Code:', fcmCode);
    });


    this.userProfile = JSON.parse(this.authService.getUserInfo());
    this.profileUrl = 'https://ui-avatars.com/api/?name=' + this.userProfile.doctor_name;
  }
  logout() {
    Swal.fire({
      title: 'Are You Sure!. Do you want to Logout?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        // this.router.navigate(['/login'])
        window.location.href = '/login';
      }
    })

  }

}
