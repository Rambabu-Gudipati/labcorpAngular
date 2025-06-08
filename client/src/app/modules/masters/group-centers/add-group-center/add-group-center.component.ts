import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientService } from '../../../../services/http-client-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-group-center',
  templateUrl: './add-group-center.component.html',
  styleUrls: ['./add-group-center.component.css']
})
export class AddGroupCenterComponent implements OnInit {
  buttonTitle: string = "Save";
  id: number = 0;
  place_lat: any = 0;
  place_lng: any = 0;
  form: FormGroup;
  city: string | undefined;
  state: string | undefined;
  pincode: string | undefined;
  submitted = false
  entity_types: Array<any> = [];
  states_list: Array<any> = [];
  city_list: Array<any> = [];
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal) { }
  ngOnInit(): void {
    this.initializeAutocomplete();
    // Loading Group User Types
    this.httpService.get(AppConstants.GET_GROUP_TYPES)
      .subscribe(response => {
        this.entity_types = response;
      });

    //Loadin States
    this.httpService.get(AppConstants.GET_STATES)
      .subscribe(response => {
        this.states_list = response[0]['states'];
        this.city_list = this.states_list[0]['cities']
        if (this.isEdit === true) {
          this.bindData();
        }
      });
    this.form = this.formBuilder.group(
      {
        //  id: [''],
        center_name: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        address: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        pincode: ['', [Validators.required]],
        contact_name: ['', [Validators.required, Validators.minLength(5)]],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]]



      }
    );
  }

  initializeAutocomplete(): void {
    const input = document.getElementById('autocomplete') as HTMLInputElement;

    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'IN' },
      });
      // Optional: Listen to place changed event
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          this.place_lat = place.geometry.location?.lat();
          this.place_lng = place.geometry.location?.lng();
          console.log('place:', place);
          this.setPlacevalues(place);
          this.form.patchValue({
            address: place.formatted_address,
            latitude: this.place_lat,
            longitude: this.place_lng
          });

          // this.getElevation(Number(lat), Number(lng));
        } else {
          console.log('No details available for input: ' + input.value);
        }
      });
    }
  }
  private setPlacevalues(place: google.maps.places.PlaceResult) {
    for (const component of place?.address_components!) {

      if (component.types.includes('administrative_area_level_1')) {
        this.state = component.long_name;
        this.setStateValue();
      }
      if (component.types.includes('locality')) {
        this.city = component.long_name;

        this.form.patchValue({
          city: this.city
        });
      }
      if (component.types.includes('postal_code')) {
        this.pincode = component.long_name;
        this.form.patchValue({
          pincode: this.pincode
        });
      }
    }
  }

  getElevation(lat: number, lng: number): void {
    const elevator = new google.maps.ElevationService();
    const location = new google.maps.LatLng(lat, lng);

    elevator.getElevationForLocations({ locations: [location] }, (results: any, status: any) => {
      if (status === google.maps.ElevationStatus.OK) {
        if (results[0]) {
          console.log('Elevation:', results[0].elevation);
        } else {
          console.log('No elevation data available.');
        }
      } else {
        console.error('Elevation request failed due to:', status);
      }
    });
  }

  bindData() {
    this.place_lat = this.editDataModel?.latitude,
      this.place_lng = this.editDataModel?.longitude,
      this.form.patchValue({
        center_name: this.editDataModel?.center_name,
        latitude: this.editDataModel?.latitude,
        longitude: this.editDataModel?.longitude,
        address: this.editDataModel?.address,
        state: this.editDataModel?.state,
        city: this.editDataModel?.city,
        pincode: this.editDataModel?.pincode,
        contact_name: this.editDataModel?.contact_name,
        email: this.editDataModel?.email,
        mobile_no: this.editDataModel?.mobile_no,
      });




  }
  dismissModal() {
    this.activeModal.close();
  }
  onSubmit(): void {
    this.submitted = true;
    console.log(this.form);
    if ((this.place_lat == 0 || this.place_lat == undefined || this.place_lat == null) ||
      (this.place_lng == 0 || this.place_lng == undefined || this.place_lng == null)) {
      //Swal.fire('Requred Fields Are Missing', 'Please select Address from Google', 'success')
      this.toastr.error('Requred Fields Are Missing', 'Please select Address from Google');
      return;
    }
    if (this.form.invalid) {
      return;
    }

    if (this.isEdit == false) {
      //  this.form.value['id'] = 0;
      this.httpService.postWithAuth(AppConstants.CREATE_GROUP_USER_LOCATIONS, JSON.stringify(this.form.value, null, 2)).subscribe(
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
      this.httpService.patch(AppConstants.UPDATE_GROUP_USER_LOCATIONS, JSON.stringify(this.form.value, null, 2)).subscribe(
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
    //this.toastr.success(data.message, "Success");
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

  onStateChanged(stateId: any) {
    // this.states_list.forEach(state => {
    //   if (state.id == stateId) {
    //     this.city_list = state.cities;
    //     if (this.city != null && this.city != undefined) {
    //       this.setCityValue();

    //     }
    //   }
    // });

  }
  setStateValue() {
    this.states_list.forEach(element => {
      if (element.name === this.state) {
        this.form.patchValue({
          state: element.id
        });
        this.onStateChanged(element.id);

      }
    });
  }
  // setCityValue() {
  //   this.city_list.forEach(element => {
  //     if (element.name === this.city) {
  //       this.form.patchValue({
  //         city: element.id
  //       });
  //       this.city = undefined;
  //     }
  //   });
  // }
}

