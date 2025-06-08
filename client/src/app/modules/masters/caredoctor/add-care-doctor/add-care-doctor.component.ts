import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-care-doctor',

  templateUrl: './add-care-doctor.component.html',
  styleUrl: './add-care-doctor.component.scss'
})
export class AddCareDoctorComponent implements OnInit{
 @Input() modalHeaderTitle: string = "ADD Care Doctor";
  buttonTitle: string = "Save";
  sortProperty: string = 'user_name';
  doctor_id: number = 0;
  form: FormGroup;
  submitted = false
  isLoading: boolean = false;
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        username: ['', [Validators.required,Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        // qualification: ['', [Validators.required, Validators.minLength(2)]],
        // id_proof_type: ['', [Validators.required, Validators.minLength(6)]],
        // id_proof_number: ['', [Validators.required, Validators.minLength(6)]],
        // address: ['', [Validators.required, Validators.minLength(10)]],
        // profile_pic: [''],
        // user_type: ['5']
      }
    );
  }
  onSubmit(): void {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    var data={
      //  "id":Number(this.form.value['id']),
      "username":this.form.value['username'],
      "email": this.form.value['email'],
      "mobile_no":this.form.value['mobile_no'],
   
    };

    
      this.httpService.postWithAuth(AppConstants.CREATE_CARE_DOCTOR, data).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    } 

  private showErrorMessage(error: any) {
    this.isLoading = false;
    console.error('An error occurred:', error);
    if (error.message == null || error.message == undefined) {
      this.toastr.error(error.message, "Error");
    } else {
      this.toastr.error(error, "Error");
    }
  }

  private showSuccessMessage(response: any) {
    this.isLoading = false;
    var data = response;
    //this.toastr.success(data.message, "Success");
    Swal.fire('Saved!', data.message, 'success')
    this.form.reset();
    this.modalService.dismissAll();
  }
  dismissModal() {
    this.activeModal.close();
  }
  resetForm() {
    this.form.reset();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
