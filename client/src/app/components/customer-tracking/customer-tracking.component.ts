import { Component, Input } from '@angular/core';
import { MapMarker } from '@angular/google-maps';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../app-constants';
import { HttpClientService } from '../../services/http-client-service';

@Component({
  selector: 'app-customer-tracking',
    templateUrl: './customer-tracking.component.html',
  styleUrl: './customer-tracking.component.scss'
})
export class CustomerTrackingComponent {
  @Input() sosId: any = 0;
  loading = false;
  sosData: any = {};
  markers: google.maps.MarkerOptions[];
  mapOptions: google.maps.MapOptions = {};

  center: google.maps.LatLngLiteral = { lat: 17.5120042, lng: 78.3638194 };
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(private httpService: HttpClientService,

    private activeModal: NgbActiveModal,) { }
  report_date: any;
  ngOnInit() {
    this.loadSOSData();
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

      });
  }
  dismissModal() {
    this.activeModal.close();
  }
}
