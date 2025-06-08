import { Component } from '@angular/core';
import { HttpClientService } from '../../../services/http-client-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddYearlyscreenTestComponent } from '../add-yearlyscreen-test/add-yearlyscreen-test.component';
import { AppConstants } from '../../../app-constants';
import { AssignLabComponent } from '../../mentormodule/assign-lab/assign-lab.component';
import { SampleCollectionComponent } from '../../mentormodule/sample-collection/sample-collection.component';
import { UploadPdfComponent } from '../../mentormodule/upload-pdf/upload-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-yearly-screen',

  templateUrl: './list-yearly-screen.component.html',
  styleUrl: './list-yearly-screen.component.scss'
})
export class ListYearlyScreenComponent {

  isButtonsDisabled: boolean = false;
    patient_data:any={};
    items: any={};
    form: FormGroup;
  checkBookingTimeSlots: boolean = false;
    checkedItems: string[] = [];
  tableData: any;
    constructor(private httpService: HttpClientService,  private modalservice: NgbModal,private toastr: ToastrService,) {
      // this.httpService. listen().subscribe((m:any)=>{
      //   console.log(m);
      // this.addUser();
      // })
    }
    ngOnInit(): void {
      const patientDataString = sessionStorage.getItem('patient_data');
      if (patientDataString) {
        this.patient_data = JSON.parse(patientDataString);
      } else {
        console.error('No patient data found in sessionStorage');
        this.patient_data = null;
      }
    
    this.checkedItems = new Array<string>();
    this.loadYearlyscreenData();
   
  }
    addYearlyscreenTest() {
      const modalRef = this.modalservice.open(AddYearlyscreenTestComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.user_id = this.patient_data.user_id;
      modalRef.componentInstance.modalHeaderTitle = "ADD New Test"
      modalRef.result.then((result: any) => {
        console.log(result);
        //this.loadGroupUsers();
      }).catch((error: any) => {
        console.log(error);
        //this.loadGroupUsers();
      });
    
    }
  loadYearlyscreenData()
  {
    this.httpService.getwithAuth(`${AppConstants.GET_YEARLYSCREEN}${this.patient_data.user_id}`)
    .subscribe(res => {
      this.items = res.data; 
       this.validateTimeSlots();
       this.isAllHaveUploadReport();
    });
  } 
  onTestChecked($event: any, id: string) {

    if ($event.target.checked) {
      // Add the checked item to the array
      if (!this.checkedItems.includes(id)) {
        this.checkedItems.push(id);
      }
      console.log(`${id} Checked`);
    } else {
      // Remove the unchecked item from the array
      const index = this.checkedItems.indexOf(id);
      if (index !== -1) {
        this.checkedItems.splice(index, 1);
      }
      console.log(`${id} Unchecked`);
    }
  
    // Log the updated checked items array
    console.log('Checked Items:', this.checkedItems);
  }
  validateTimeSlots() {
    for (let item of this.items) {
      if (item.booking_time_slot_name == '') {
        this.checkBookingTimeSlots = false;
        return;

      }
    }
    this.checkBookingTimeSlots = true;

  }

  isAllHaveUploadReport(): void {
   for (let item of this.items) {
      if (item.status != 4) {
        this.isButtonsDisabled = false;
        return;

      }
      this.isButtonsDisabled = true;
    }

    
    
  }
 

  // Action methods
  assignLab(): void {
    if (this.checkedItems.length == 0) {
      this.toastr.error('Please Select Atleast One Test'); // Show error if nothing is selected
      return;
    }
    const checkedItems = this.items?.filter((item: any) =>
      this.checkedItems?.includes(item.id)
    );

    // Check for items without time slots
    const invalidItems = checkedItems.filter((item: { booking_time_slot_name: any; }) => item.booking_time_slot_name !='');

    if (invalidItems.length > 0) {
      this.toastr.error(
        'Error: Already Assigned Lab:\n' +
          invalidItems.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }
    const dueDate =  checkedItems.filter((item: { due_date: any; }) => item.due_date);

    const modalRef = this.modalservice.open(AssignLabComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isYearlyScreeing = true;
    modalRef.componentInstance.Reschedule = false;
    modalRef.componentInstance.dueDate = dueDate[0].due_date;
    modalRef.componentInstance.checkedItems = this.checkedItems;
    modalRef.componentInstance.modalHeaderTitle = "Assign Lab"
    modalRef.componentInstance.isReschedule = false;
    modalRef.result.then((result: any) => {
      console.log(result);
      window.location.reload();
    }).catch((error: any) => {
      console.log(error);
      window.location.reload();
    }); 
  }

  rescheduleLab(): void {
    if (this.checkedItems.length == 0) {
      this.toastr.error('Please Select Atleast One Test'); // Show error if nothing is selected
      return;
    }
    const checkedItems = this.items.filter((item: { id: string; }) =>
      this.checkedItems.includes(item.id)
    );

    // Check for items without time slots
    const invalidItems = checkedItems.filter((item: { booking_time_slot_name: any; }) => !item.booking_time_slot_name);

    if (invalidItems.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be rescheduled. Lab not yet assigned:\n' +
        invalidItems.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }



    const invalidItem = checkedItems.filter((item: { status: any; }) => item.status==4);

    if (invalidItem.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Rescheduled.Already Report Uploaded:\n' +
        invalidItem.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }


    const statusValid = checkedItems.filter((item: { status: any; }) => item.status==3);

    if (statusValid.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Reschedules.Already Sample Collection Done:\n' +
        statusValid.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }
    const dueDate =  checkedItems.filter((item: { due_date: any; }) => item.due_date);
    const modalRef = this.modalservice.open(AssignLabComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isYearlyScreeing = true;
    modalRef.componentInstance.Reschedule = true;
    modalRef.componentInstance.dueDate = dueDate[0].due_date;
    modalRef.componentInstance.checkedItems = this.checkedItems;
    modalRef.componentInstance.modalHeaderTitle = "Reschedule Lab"
    modalRef.componentInstance.isReschedule = true;
    modalRef.componentInstance.isEdit = true;
  
    modalRef.result.then((result: any) => {
      console.log(result);
      window.location.reload();
    }).catch((error: any) => {
      console.log(error);
      window.location.reload();
    });
  }

  sampleCollection(): void {
    if (this.checkedItems.length == 0) {
      this.toastr.error('Please Select Atleast One Test'); // Show error if nothing is selected
      return;
    }
    const checkedItems = this.items.filter((item: { id: string; }) =>
      this.checkedItems.includes(item.id)
    );

    // Check for items without time slots
    const invalidItems = checkedItems.filter((item: { booking_time_slot_name: any; }) => !item.booking_time_slot_name);

    if (invalidItems.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Updated Collections. Lab not yet assigned:\n' +
        invalidItems.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }



    const invalidItem = checkedItems.filter((item: { status: any; }) => item.status==4);

    if (invalidItem.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Update Sample Collection.Already Report Uploaded:\n' +
        invalidItem.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }



    const statusValid = checkedItems.filter((item: { status: any; }) => item.status==3);

    if (statusValid.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Update Sample Collection.Already Sample Collection Done:\n' +
        statusValid.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }

    const statusValids = checkedItems.filter((item: { status: any; }) => item.status==6);

    if (statusValids.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Update Sample Collection:\n' +
        statusValids.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }
    const modalRef = this.modalservice.open(SampleCollectionComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isYearlySampleCollection  = true;
     modalRef.componentInstance.checkedItems = this.checkedItems;
    modalRef.componentInstance.modalHeaderTitle = "Sample Collection"
    modalRef.result.then((result: any) => {
      console.log(result);
      window.location.reload();
    }).catch((error: any) => {
      console.log(error);
      window.location.reload();
    });
  }


  uploadPdf(booking_id:any) {
    const modalRef = this.modalservice.open(UploadPdfComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.yearlyUpload = true;
    modalRef.componentInstance.prescriptionUpload=false;
    modalRef.componentInstance.bookingId = booking_id;
    const item = this.items.find((x: { id: any; }) => x.id === booking_id);
    if (item) {
      setTimeout(() => {
        item.reportUploaded = true;
        item.status = 3; // Update the status to reflect "View Report"
        item.report_url = ''; // Replace with actual report URL
        console.log('Report uploaded successfully');
      }, 1000); // Simulate a delay for upload
    }
    
    modalRef.result.then((result) => {
      console.log(result);
      window.location.reload();
    }).catch((error) => {
      console.log(error);
      window.location.reload();
    });
    }
    viewReport(bookingId: number) {
      const item = this.items.find((x: { id: number; }) => x.id === bookingId);
      if (item && item.report_url) {
        console.log(`Viewing report for booking ID: ${bookingId}`);
        window.open(item.report_url, '_blank'); // Open the report in a new tab
      } else {
        console.error('No report available to view');
      }
    }
    removeData(rowId:any) {

   
    const data = { id: rowId };

  this.httpService.patch(AppConstants.DELETE_YERALY_SCREEN, data).subscribe(res => {
    let result: any;
        result = res;
        if (confirm('Do you want to remove this Test :' + rowId)) {
        if (result.status == true) {
          this.toastr.success('Removed Successfully.', 'Remove Test')
      
         this.loadYearlyscreenData();
        } else {
          this.toastr.error('Failed to Remove.', 'Test');
        }
        window.location.reload();
        }
  });
  
}

   
    
}

