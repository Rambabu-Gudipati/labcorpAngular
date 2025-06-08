import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';
import { data } from 'jquery';

@Component({
  selector: 'app-add-care-mentor',

  templateUrl: './add-care-mentor.component.html',
  styleUrl: './add-care-mentor.component.scss'
})
export class AddCareMentorComponent implements OnInit{
  @Input() modalHeaderTitle: string = "ADD Group User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false
  loading: boolean;
  items: any[] = [];
  
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {
    // Loadin States
    // this.httpService.get(AppConstants.GET_CATEGORIES)
    // .subscribe(response => {
    //   this.category_list = response;
    //   this.subcategory_list = this.category_list[0]['sub_categories']
    //   if (this.isEdit === true) {
    //     this.bindData();
    //   }
    // });

    
    this.form = this.formBuilder.group(
      {
        // id: [''],
        username: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        // password: ['', [Validators.required, Validators.minLength(6)]],
       

        // test_category: ['', [Validators.required]],
        // test_sub_category: ['', [Validators.required]],
      
        
      }
     
    );
    if (this.isEdit === true) {
      this.bindData();
   }
   
  }

  bindData() {

    this.form.patchValue({
      username: this.editDataModel?.username,
      email: this.editDataModel?.email,
      mobile_no: this.editDataModel?.mobile_no,
      // password: this.editDataModel?.password,
      
    
     
    });
    // this.onStateChanged(this.editDataModel?.test_category)
    // this.form.patchValue({
    //   test_sub_category: this.editDataModel?.test_sub_category,
      
    // });


  }
  dismissModal() {
    this.activeModal.close();
    // this.httpService.filter("register click");
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
      "username": this.form.value['username'],
      "email":Number(this.form.value['email']),
      "mobile_no": this.form.value['mobile_no'],
      
    };
    if (this.isEdit == false) {
      this.httpService.postWithAuth(AppConstants.CREATE_CARE_MENTOR, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    } else {
      this.form.value['id'] = this.editDataModel?.id;
      this.httpService.patch(AppConstants.UPDATE_CARE_MENTOR, JSON.stringify(this.form.value, null, 2)).subscribe(
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
    this.toastr.error(error, "Error");

  }

  private showSuccessMessage(response: any) {
    var data = response;
    // this.toastr.success(data.message, "Success");
    Swal.fire(this.isEdit ? 'Updated' : 'Saved', data.message, 'success')
    this.form.reset();
    this.modalService.dismissAll(true);
  }

  resetForm() {
    this.form.reset();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // onStateChanged(test_categoryId: any) {
  //   this.category_list.forEach(test_category => {
  //     if (test_category.id == test_categoryId) {
  //       this.subcategory_list = test_category.sub_categories;
  //     }
  //   });

  // }
}
