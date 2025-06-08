import { data } from 'jquery';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../../../services/http-client-service';
import { ActivatedRoute } from '@angular/router';
import { AppConstants } from '../../../app-constants';
import { ListMentorOrdersComponent } from '../list-mentor-orders/list-mentor-orders.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignLabComponent } from '../assign-lab/assign-lab.component';
import { AuthService } from '../../../services/auth.service';
import { FormGroup } from '@angular/forms';
import { UploadPdfComponent } from '../upload-pdf/upload-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { SampleCollectionComponent } from '../sample-collection/sample-collection.component';

@Component({
  selector: 'app-view-orders',

  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.scss'
})
export class ViewOrdersComponent implements OnInit {
  @Input() editDataModel: any = {};
  @Input() id: any = 0;
  @Input() isEdit: boolean = false;
  loading = false;
  time_list: Array<any> = [];
  items: any = {};
  checkBookingTimeSlots: boolean = false;
  showError = false;
  selectedItems: string[];
  form: FormGroup;
  isButtonsDisabled: boolean = false;
  constructor(private httpService: HttpClientService, private route: ActivatedRoute, private modalservice: NgbModal, private auth: AuthService, 
    private toastr: ToastrService,) { }



  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.loadOdersData();
      // You can now use this ID to fetch data or perform other actions
    });

    this.selectedItems = new Array<string>();


  }


  onTestChecked($event: any, diagnostic_booking_id: string) {

    if ($event.target.checked) {
      console.log(diagnostic_booking_id + 'Checked');
      this.selectedItems.push(diagnostic_booking_id);
    }
    else {
      console.log(diagnostic_booking_id + 'UNChecked');
      this.selectedItems = this.selectedItems.filter(m => m != diagnostic_booking_id);
    }
    console.log(this.selectedItems);
  }


  loadOdersData() {
    this.loading = true;
    this.httpService.getwithAuth(AppConstants.GET_ORDERS_BY_ID + '/' + this.id)
      .subscribe(res => {
        this.items = res;
        this.isAllHaveUploadReport();
        this.validateTimeSlots();
        if (this.isEdit === true) {
          this.bindData();
        }
      });
  }
  dismissModal() {

  }

  loadTimeSlot() {
    this.httpService.getwithAuth(AppConstants.GET_TIME_SLOTS)
      .subscribe(response => {
        this.time_list = response;

      });
  }

  bindData() {

    this.form.patchValue({
      test_name: this.editDataModel?.test_name,
      amount: this.editDataModel?.amount,
      technician_name: this.editDataModel?.technician_name,
      techinician_contact_no: this.editDataModel?.techinician_contact_no,
      booking_date: this.editDataModel?.booking_date,
      booking_time_slot_name: this.editDataModel?.booking_time_slot_name,

    });

  }

  assignLab() {
    if (this.selectedItems.length == 0) {
      this.toastr.error('Please Select Atleast One Test'); // Show error if nothing is selected
      return;
    }

   

    // Find the corresponding items for the selected IDs
    const selectedItems = this.items.data.filter((item: { diagnostic_booking_id: string; }) =>
      this.selectedItems.includes(item.diagnostic_booking_id)
    );

    // Check for items without time slots
    const invalidItems = selectedItems.filter((item: { booking_time_slot_name: any; }) => item.booking_time_slot_name !='');

    if (invalidItems.length > 0) {
      this.toastr.error(
        'Error: Already Assigned Lab:\n' +
          invalidItems.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }
   



    const modalRef = this.modalservice.open(AssignLabComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.selectedItems = this.selectedItems;
    modalRef.componentInstance.modalHeaderTitle = "Assign Lab"
    modalRef.componentInstance.isYearlyScreeing = false;
    modalRef.componentInstance.isReschedule = false;
    modalRef.result.then((result: any) => {
      console.log(result);
      window.location.reload();
    }).catch((error: any) => {
      console.log(error);
      window.location.reload();
    });

  }

  rescheduleLab() {
    if (this.selectedItems.length == 0) {
      this.toastr.error('Please Select Atleast One Test'); // Show error if nothing is selected
      return;

    }


    // Find the corresponding items for the selected IDs
    const selectedItems = this.items.data.filter((item: { diagnostic_booking_id: string; }) =>
      this.selectedItems.includes(item.diagnostic_booking_id)
    );

    // Check for items without time slots
    const invalidItems = selectedItems.filter((item: { booking_time_slot_name: any; }) => !item.booking_time_slot_name);

    if (invalidItems.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be rescheduled. Lab not yet assigned:\n' +
        invalidItems.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }



    const invalidItem = selectedItems.filter((item: { booking_status_id: any; }) => item.booking_status_id==4);

    if (invalidItem.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Rescheduled.Already Report Uploaded:\n' +
        invalidItem.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }


    const statusValid = selectedItems.filter((item: { booking_status_id: any; }) => item.booking_status_id==3);

    if (statusValid.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Reschedules.Already Sample Collection Done:\n' +
        statusValid.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }

   
    const modalRef = this.modalservice.open(AssignLabComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.selectedItems = this.selectedItems;
    modalRef.componentInstance.modalHeaderTitle = "Reschedule Lab"
    modalRef.componentInstance.isYearlyScreeing = false;
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

 sampleCollection() {


    if (this.selectedItems.length === 0) {
      this.toastr.error('Please Assign Lab First')
      return;
    }

    // Find the corresponding items for the selected IDs
    const selectedItems = this.items.data.filter((item: { diagnostic_booking_id: string; }) =>
      this.selectedItems.includes(item.diagnostic_booking_id)
    );

    // Check for items without time slots
    const invalidItems = selectedItems.filter((item: { booking_time_slot_name: any; }) => !item.booking_time_slot_name);

    if (invalidItems.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Updated Collections. Lab not yet assigned:\n' +
        invalidItems.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }



    const invalidItem = selectedItems.filter((item: { booking_status_id: any; }) => item.booking_status_id==4);

    if (invalidItem.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Update Sample Collection.Already Report Uploaded:\n' +
        invalidItem.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }



    const statusValid = selectedItems.filter((item: { booking_status_id: any; }) => item.booking_status_id==3);

    if (statusValid.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Update Sample Collection.Already Sample Collection Done:\n' +
        statusValid.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }

    const statusValids = selectedItems.filter((item: { booking_status_id: any; }) => item.booking_status_id==6);

    if (statusValids.length > 0) {
      this.toastr.error(
        'Error: The following items cannot be Update Sample Collection:\n' +
        statusValids.map((item: { test_name: any; }) => `- ${item.test_name}`).join('\n')
      );
      return;
    }

   
    const modalRef = this.modalservice.open(SampleCollectionComponent, { centered: true, size: 'lg' });
     modalRef.componentInstance.isYearlySampleCollection  = false;
     modalRef.componentInstance.selectedItems = this.selectedItems;
    modalRef.componentInstance.modalHeaderTitle = "Sample Collection"
    modalRef.result.then((result: any) => {
      console.log(result);
      window.location.reload();
    }).catch((error: any) => {
      console.log(error);
      window.location.reload();
    });
  }

  validateTimeSlots() {
    for (let item of this.items.data) {
      if (item.booking_time_slot_name == '') {
        this.checkBookingTimeSlots = false;
        return;

      }
    }
    this.checkBookingTimeSlots = true;

  }
  


  uploadPdf(booking_id:any) {
    const modalRef = this.modalservice.open(UploadPdfComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.yearlyUpload = false;
    modalRef.componentInstance.prescriptionUpload=false;
    modalRef.componentInstance.bookingId = booking_id;
    const item = this.items.data.find((x: { diagnostic_booking_id: any; }) => x.diagnostic_booking_id === booking_id);
    if (item) {
      setTimeout(() => {
        item.reportUploaded = true;
        item.booking_status_id = 3; // Update the status to reflect "View Report"
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
    const item = this.items.data.find((x: { diagnostic_booking_id: number; }) => x.diagnostic_booking_id === bookingId);
    if (item && item.report_url) {
      console.log(`Viewing report for booking ID: ${bookingId}`);
      window.open(item.report_url, '_blank'); // Open the report in a new tab
    } else {
      console.error('No report available to view');
    }
  }

 

  
  
 
  isAllHaveUploadReport(): void {
   
    if(this.items.userOrderDetails.order_status_id==5)
      {
        this.isButtonsDisabled = true;
        return;
      }
      
    for (let item of this.items.data) {
      if (item.booking_status_id != 4) {
        this.isButtonsDisabled = false;
        return;

      }
    }

    
    this.isButtonsDisabled = true;
  }
 





}