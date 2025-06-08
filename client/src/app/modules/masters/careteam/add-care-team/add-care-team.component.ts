import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-add-care-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-care-team.component.html',
  styleUrl: './add-care-team.component.scss'
})
export class AddCareTeamComponent implements OnInit {
  @Input() user_type: number;
  @Input() modalHeaderTitle: string = "ADD Care Team";
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
        profile_pic: [''],
        user_type: ['5']
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
    this.isLoading = true;
    if (this.doctor_id == 0) {
      this.form.value['user_type'] = this.user_type;
      this.httpService.postWithAuth(AppConstants.CREATE_CARE_TEAM, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    } else {
      var test = this.form.value.HashMap();
      test.add({ id: this.doctor_id });

      this.httpService.patch(AppConstants.UPDATE_USER, JSON.stringify(test, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
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
