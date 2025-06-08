import { Component, Input, OnInit } from '@angular/core';
import { AppConstants } from '../../app-constants';
import { HttpClientService } from '../../services/http-client-service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { CustomerTrackingComponent } from '../customer-tracking/customer-tracking.component';
import { AmbulanceTrackingComponent } from '../ambulance-tracking/ambulance-tracking.component';

@Component({
  selector: 'app-view-sos',
  templateUrl: './view-sos.component.html',
  styleUrls: ['./view-sos.component.css']
})
export class ViewSosComponent implements OnInit {
  @Input() ambulance_id = 0;
  @Input() sosId: any = 0;
  loading = false;
  sosData: any = {};
  markers: google.maps.MarkerOptions[];
  mapOptions: google.maps.MapOptions = {};
  report_date: any;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 17;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(private httpService: HttpClientService, private route: ActivatedRoute, private modalService: NgbModal) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sosId = params.get('id');
      this.loadSOSData();
      // You can now use this ID to fetch data or perform other actions
    });

    // var centerLatLng = { lat: 17.5120042, lng: 78.3638194 };
    // this.mapOptions.center = new google.maps.LatLng(centerLatLng.lat, centerLatLng.lng);
    // this.mapOptions.zoom = 15;
    // this.markers.push({
    //   position: centerLatLng,
    //   title: 'Patient Location'
    // });
  }
  loadSOSData() {
    this.loading = true;
    this.httpService.get(AppConstants.GET_SOS_BY_Id + '/' + this.sosId)
      .subscribe(x => {
        this.sosData = x.data;
        this.center.lat = this.sosData.latitude;
        this.center.lng = this.sosData.longitude;
      });
  }
  dismissModal() {

  }
  loadPatientMap(){
  const modalRef = this.modalService.open(CustomerTrackingComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.sosId = this.sosId;
    modalRef.result.then((result) => {
      console.log(result);

    }).catch((error) => {
      console.log(error);

    });
  }
 
}
