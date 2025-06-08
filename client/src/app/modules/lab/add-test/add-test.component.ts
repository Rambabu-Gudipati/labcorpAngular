import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../services/http-client-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-test',

  templateUrl: './add-test.component.html',
  styleUrl: './add-test.component.scss'
})
export class AddTestComponent implements OnInit {
  @Input() modalHeaderTitle: string = "ADD Group User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  entity_types: Array<any> = [];
  category_list: Array<any> = [];
  subcategory_list: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false

  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {

    this.httpService.get(AppConstants.GET_CATEGORIES)
      .subscribe(response => {
        this.category_list = response;
        this.subcategory_list = this.category_list[0]['sub_categories']
        if (this.isEdit === true) {
          this.bindData();
        }
      });


    this.form = this.formBuilder.group(
      {
        // id: [''],
        test_name: ['', [Validators.required]],
        price: ['', [Validators.required]],
        test_description: ['', [Validators.required]],
        test_category: ['', [Validators.required]],
        test_sub_category: ['', [Validators.required]],
        sample_collection_in_home: [true, [Validators.required]],
        fasting: [false, [Validators.required]],
        report_duration: ['', [Validators.required]],

      }
    );

  }

  bindData() {

    this.form.patchValue({
      test_name: this.editDataModel?.test_name,
      price: this.editDataModel?.price,
      test_description: this.editDataModel?.test_description,
      test_category: this.editDataModel?.test_category,
      test_sub_category: this.editDataModel?.test_sub_category,
      fasting: this.editDataModel?.fasting,
      report_duration: this.editDataModel?.report_duration,
    });
    this.onStateChanged(this.editDataModel?.test_category)
    this.form.patchValue({
      test_sub_category: this.editDataModel?.test_sub_category,

    });


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
    var data = {
      "test_name": this.form.value['test_name'],
      "price": Number(this.form.value['price']),
      "test_description": this.form.value['test_description'],
      "test_category": Number(this.form.value['test_category']),
      "test_sub_category": Number(this.form.value['test_sub_category']),
      "sample_collection_in_home": this.form.value['sample_collection_in_home'],
      "fasting": this.form.value['fasting'],
      "report_duration": this.form.value['report_duration']

    };
    if (this.isEdit == false) {
      this.httpService.postWithAuth(AppConstants.CREATE_DIAGNOSTIC_TEST, data).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    } else {
     var  edit_data = {
        "id":  this.editDataModel?.id,
        "test_name": this.form.value['test_name'],
        "price": Number(this.form.value['price']),
        "test_description": this.form.value['test_description'],
        "test_category": Number(this.form.value['test_category']),
        "test_sub_category": Number(this.form.value['test_sub_category']),
        "sample_collection_in_home": this.form.value['sample_collection_in_home'],
        "fasting": this.form.value['fasting'],
        "report_duration": this.form.value['report_duration']
  
      };
      this.httpService.patch(AppConstants.UPDATE_DIAGNOSTIC_TEST, edit_data).subscribe(
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

  onStateChanged(test_categoryId: any) {
    this.category_list.forEach(test_category => {
      if (test_category.id == test_categoryId) {
        this.subcategory_list = test_category.sub_categories;
      }
    });

  }
}
