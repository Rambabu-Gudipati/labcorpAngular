import { Component, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-add-config',

  templateUrl: './add-config.component.html',
  styleUrl: './add-config.component.scss'
})
export class AddConfigComponent {

  @Input() modalHeaderTitle: string = "ADD Issues";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  @ViewChild('dt1') dt1!: Table;
 
  // filtered_data: any;
  pdfurl = '';
  invoiceno: any;
  user_types: Array<any> = [];
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  filtered_data: any[] = [];
  data: any[] = [];
  loading = false;
  list_configuration: Array<any> = [];

  numof_devices: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false
  onStateChanged: any;
  
  devices: any;
  items: any[];
  searchValue: any;
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService,  private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }


  ngOnInit() {

    

  
// if(this.isEdit === true)
// {
//   this.bindData();
// }

 

    this.httpService.getwithAuth(AppConstants.LIST_CONFIGURATION)
      .subscribe(response => {
        this.list_configuration = response;

      });
   



    this.form = this.formBuilder.group(
      {
        // id: [''],
        object_type: ['', [Validators.required]],
        amount: ['', [Validators.required,Validators.min(3),Validators.max(1000000),Validators.pattern(/^\d+$/),]],
       

      }
    );

  }

  bindData() {

    this.form.patchValue({
      object_type_name: this.editDataModel?.object_type_name,
      amount: this.editDataModel?.amount,
    

    });
   


  }
  dismissModal() {
    this.activeModal.close();
  }
  onSubmit(): void {

    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
     var data={
      "object_type": Number(this.form.value['object_type']),
      "amount": Number(this.form.value['amount']),
     }
   
      this.httpService.postWithAuth(AppConstants.CREATE_CONFIGURATION, data).subscribe(
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


 
  
  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement)?.value;
    if (value) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }
  clear() {
    this.dt1.clear();
  }
}
