import { NgClass } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HttpClientService } from '../../../services/http-client-service';
import { AppConstants } from '../../../app-constants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UtilsServiceService } from '../../../services/util-service';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() loginClicked = new EventEmitter<void>();
  isLoading = false;
  isError = false;
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  submitted = false;

  constructor(private formBuilder: FormBuilder, private authService: HttpClientService,private auth:AuthService,
    private toastr: ToastrService, private router: Router, private eventService: EventService,
    private util: UtilsServiceService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        emailOrPhoneNumber: ['', [Validators.required,Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(40),
          ],
        ]
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
onSubmit(): void {
  const email = this.form.get('emailOrPhoneNumber')!.value;
  const pwd   = this.form.get('password')!.value;

  // 2️⃣ Check hard-coded admin credentials
  if (email === 'admin@gmail.com' && pwd === 'password') {
    // Successful “fake” login — skip backend entirely!
    var data = {
    "message": "Login successfully",
    "data": {
        "role": "Admin",
        "user_id": 8,
        "username": "Adminstrator",
        "mobileNo": "7111111111",
        "email": "admin@gmail.com",
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJBZG1pbnN0cmF0b3IiLCJ1c2VyX3R5cGUiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzQ5NDU0MDc5LCJleHAiOjE3NDk0NTc2Nzl9.KePZbFyhBVHoz5QjdYxWMAf7FW-zREOQDX9v7EX02tg"
    }
};
      localStorage.setItem('access_token', this.util.encrypt_Text('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJBZG1pbnN0cmF0b3IiLCJ1c2VyX3R5cGUiOjEsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNzQ5NDU0MDc5LCJleHAiOjE3NDk0NTc2Nzl9.KePZbFyhBVHoz5QjdYxWMAf7FW-zREOQDX9v7EX02tg') || "")
      localStorage.setItem('user_data', this.util.encrypt_Text(JSON.stringify(data)) || "")
    this.toastr.success('Logged in as admin', 'Success');
    this.eventService.loginEvent.emit();
    this.router.navigate(['/masters/doctors']);
    // ← adjust path as needed for your admin landing page
  } else {
    // Bad credentials — show error and stop
    this.toastr.error('Invalid email or password', 'Login Failed');
    return;
  }

  // 3️⃣ (This code will never run now, unless you remove the return above)
  // this.authService.post(...)
}

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}
