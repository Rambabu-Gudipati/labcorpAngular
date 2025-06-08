import { Tests } from './../../../models/user';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../services/http-client-service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-yearlyscreen-test',

  templateUrl: './add-yearlyscreen-test.component.html',
  styleUrl: './add-yearlyscreen-test.component.scss'
})
export class AddYearlyscreenTestComponent implements OnInit{
  @Input() modalHeaderTitle: string = "";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
 test_names: Array<any> = [];
  category_list: Array<any> = [];
  subcategory_list: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false
   test_category_id=0;
test_sub_category_id=0;
test_id=0;
  @Input() user_id: any=0;
test_category: any;
currentDate: any = new Date();
selectedId: number = 0;
selectedTest: string = '';
tests: Tests[] = [];

newTests: Partial<Tests> = {};
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {

    this.httpService.get(AppConstants.GET_CATEGORIES)
      .subscribe(response => {
        this.category_list = response;
        this.subcategory_list = this.category_list[0]['sub_categories']
        // if (this.isEdit === true) {
        //   this.bindData();
        // }
      });
      // this.httpService.getwithAuth(`${AppConstants.GET_TESTNAME_BY_CATEGORIESID}?test_category_id=${this.test_category_id}&test_sub_category_id=${this.test_sub_category_id}`).subscribe(res => {
      //   this.test_names = res.data;
      // });


    this.form = this.formBuilder.group(
      {
        // id: [''],
        test_id: ['', [Validators.required]],
        due_date: ['', [Validators.required]],
      
        test_category: ['', [Validators.required]],
        test_sub_category: ['', [Validators.required]],
        

      }
    );

  }

  // bindData() {

  //   this.form.patchValue({
  //     test_id: this.editDataModel?.test_id,
   
  //     due_date: this.editDataModel?.due_date,
  //     test_category: this.editDataModel?.test_category,
  //     test_sub_category: this.editDataModel?.test_sub_category,
      
  //   });
  //   this.onTestChanged(this.editDataModel?.test_category)
  //   this.form.patchValue({
  //     test_sub_category: this.editDataModel?.test_sub_category,

  //   });


  // }
  dismissModal() {
    this.activeModal.close();
    // this.httpService.filter("register click");
  }
  onSubmit(): void {
 

    if(this.tests.length == 0)
      {
       this.toastr.error("Plese Add Atleast One Test");
      }
      var tests=[];
    for(let item of  this.tests)
    {
    
    var data = {
      "user_id":this.user_id,

      "test_id":Number(this.selectedId),
     
 
      "due_date": item.due_date
   

    };
    tests.push(data);
  }
      this.httpService.postWithAuth(AppConstants.CREATE_YEARLYSCREEN, tests).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
          window.location.reload();
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
          
        }
      );
    
  
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

  onTestChanged(test_categoryId: any) {
    this.category_list.forEach(test_category => {
      if (test_category.id == test_categoryId) {
        this.test_category_id=test_categoryId;
        this.subcategory_list = test_category.sub_categories;
      }
    });
    
    //Automatically select the first subcategory if available
   
  }
  onSubtestChange(subTest_Id:any)
  {
    this.test_names =[];
      this.httpService.getwithAuth(`${AppConstants.GET_TESTNAME_BY_CATEGORIESID}?test_category_id=${this.test_category_id}&test_sub_category_id=${subTest_Id}`)
        .subscribe(res => {
          this.test_names = res.data; // Assuming the response has a `data` field with the test names
        });
    
  }
  
onTestChange(event: Event) {
  this.selectedId = +(event.target as HTMLSelectElement).value;

  // Find the selected test by ID
  const selectedTestObj = this.test_names.find(test => test.id === this.selectedId);
  this.selectedTest = selectedTestObj ? selectedTestObj.test_name : '';

  // Update `newTests` object
  this.newTests.id = this.selectedId; // For sending to server
  this.newTests.test_name = this.selectedTest; // For displaying in the table
}





addTests() {
  this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  //  this.submitted = true;
  //  console.log(this.form);
  // Ensure all required fields are filled
  // if (!this.newTests.test_category || !this.newTests.test_sub_category || !this.newTests.test_name || !this.newTests.due_date) {
  // this.toastr.error('Missing required fields! Please Enter The Fields');
  //   return;
  // }
  if (this.newTests.test_category && this.newTests.test_sub_category && this.newTests.test_name && this.newTests.due_date) {
    // Check if a test with the same name already exists
    const isDuplicate = this.tests.some(
      test => test.test_name === this.newTests.test_name
    );

    if (isDuplicate) {
      // Ask for user confirmation
      const confirmation = window.confirm(
        'A test is  already exists. Do you want to add it again?'
      );
      if (!confirmation) {
        return; // Do not add the test
      }
    }

    // Calculate the new ID by finding the maximum id
    const newId = this.tests.length ? Math.max(...this.tests.map(u => u.id || 0)) + 1 : 1;
    this.tests.push({
      id: newId,

      // // Test ID for server
    // test_id:this.selectedId,
      test_name: this.selectedTest, // Test name for table display
      test_category: this.newTests.test_category,
      test_sub_category: this.newTests.test_sub_category,
      due_date: this.newTests.due_date,
    }  as Tests);

    // Reset form fields
    this.newTests = {};
   
  }

}

deleteTests(id: number) {
  this.tests = this.tests.filter(test => test.id !== id);
}
}
