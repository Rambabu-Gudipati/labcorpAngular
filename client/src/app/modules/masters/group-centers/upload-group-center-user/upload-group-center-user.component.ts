import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../../services/http-client-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilsServiceService } from '../../../../services/util-service';
import { AppConstants } from '../../../../app-constants';
import Papa from 'papaparse';


@Component({
  selector: 'app-upload-group-center-user',

  templateUrl: './upload-group-center-user.component.html',
  styleUrl: './upload-group-center-user.component.scss'
})
export class UploadGroupCenterUserComponent implements OnInit {
  filesaver: any;
  http: any;


  items: any[] = [];
  user_types: Array<any> = [];
  pageOfItems?: Array<any>;
  _pageOfItems?: Array<any>;
  modalHeaderTitle: string = "ADD User";
  buttonTitle: string = "Save";
  sortProperty: string = 'user_name';
  searchString: string;
  sortOrder = 1;
  loading = false;
  isLoading = false;
  isError = false;
  user_id: Number = 0;
  data: any[] = [];
  displayedColumns: string[] = []; // Store column names for the table
  submitted = false
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private util: UtilsServiceService) { }

  ngOnInit() {

   
  }




 

  dismissModal() {
    this.modalService.dismissAll();
  }

  // excelExport(){
  //   const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  //   const EXCEL_EXTENSION = '.xlsx';

  //   const blobdata=new Blob([excelBuffer],{type:EXCEL_TYPE});
  //   this.filesaver.save(blobdata,"file")
  // }

 
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: { data: any[]; }) => {
          this.data = results.data;
          if (this.data.length > 0) {
            this.displayedColumns = Object.keys(this.data[0]);
          }
        },
        error: (error: any) => {
          console.error('Error parsing CSV:', error);
        }
      });
    }
  }
}