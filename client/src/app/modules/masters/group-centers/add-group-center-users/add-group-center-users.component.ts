import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-group-center-users',

  templateUrl: './add-group-center-users.component.html',
  styleUrl: './add-group-center-users.component.scss'
})
export class AddGroupCenterUsersComponent implements OnInit{
 

  isEdit: boolean;
  editDataModel: any;
  items: any[] = [];
  user_types: Array<any> = [];
 
  modalHeaderTitle: string = "ADD User";
  buttonTitle: string = "Save";
 
  
  isLoading = false;
  isError = false;
  user_id: Number = 0;

  form: FormGroup ;
  submitted = false
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private modalService: NgbModal,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group(
      {

        email: ['', [Validators.required, Validators.email]],
        phone_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        user_type_id: ['', [Validators.required]],
        user_name: ['', [Validators.required, Validators.minLength(6)]],
      }
    );
  
        if (this.isEdit === true) {
          this.bindData();
        }

  }
  bindData() {
   
    this.form.patchValue({
      
      email: this.editDataModel?.email,
      user_name: this.editDataModel?.user_name,
      phone_no: this.editDataModel?.phone_no,
      user_type_id: this.editDataModel?.user_type_id,
    
    });
   
  }
 get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.user_id == 0) {
      this.httpService.postWithAuth(AppConstants.CREATE_USER, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
    } else {
      var test = this.form.value.HashMap();
      test.add({ id: this.user_id });

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
    console.error('An error occurred:', error);
    this.isError = true;
    this.isLoading = false;
    if (error.message == null || error.message == undefined) {
      this.toastr.error(error.message, "Error");
    } else {
      this.toastr.error(error, "Error");
    }
  }

  private showSuccessMessage(response: any) {
    var data = response;
    this.isLoading = false;
    //this.toastr.success(data.message, "Success");
    Swal.fire('Saved!', data.message, 'success')
    this.form.reset();
    this.modalService.dismissAll();
  }

  resetForm() {
    this.form.reset();
  }
  dismissModal() {
    this.modalService.dismissAll();
  }
  
  
}
