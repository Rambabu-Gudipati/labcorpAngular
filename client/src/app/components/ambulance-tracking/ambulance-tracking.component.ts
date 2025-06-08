import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../../services/http-client-service';
import { MapMarker } from '@angular/google-maps';
import { AppConstants } from '../../app-constants';
import { JoinScreenComponent } from '../../modules/video-module/components/join-screen/join-screen.component';

@Component({
  selector: 'app-ambulance-tracking',
  templateUrl: './ambulance-tracking.component.html',
  styleUrls: ['./ambulance-tracking.component.css']
})
export class AmbulanceTrackingComponent implements OnInit {

  @Input() latitude: any = 0;
  @Input() longitude: any = 0;
  @Input() ambulance_id = 0;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 18;
  report_date: any;
  markers: MapMarker[] = [];
  path: google.maps.LatLngLiteral[] = [];
  constructor(private httpService: HttpClientService,

    private activeModal: NgbActiveModal,) { }

  ngOnInit() {
    this.getCurrentLocation(this.latitude, this.longitude);
  }
  dismissModal() {
    this.activeModal.close();
  }
  getCurrentLocation(latitude: any, longitude: any) {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     this.center = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     };
    //     this.addMarker(this.center);
    //   });
    // }
    this.center = {
      lat: latitude,
      lng: longitude,
    };
    this.addMarker(this.center);

  }

  addMarker(location: google.maps.LatLngLiteral) {
    var data: any = { position: location };
    this.markers = [];
    this.markers.push(data);
  }
  addCoordinateToPath(lat: number, lng: number) {
    this.path.push({ lat, lng });
  }
  trackAmbulance() {
    // const lat = (Math.random() * 0.05 + 17.35).toFixed(6);
    // const lng = (Math.random() * 0.1 + 78.45).toFixed(6);
    // this.getCurrentLocation(parseFloat(lat), parseFloat(lng));
    // this.addCoordinateToPath(Number(lat), Number(lng));
    this.httpService.getwithAuth(AppConstants.TRACK_AMBULANC_LOCATION + this.ambulance_id)
      .subscribe(x => {
        console.log(x);
      });
  }
  // private subscription: Subscription;
  //  this.subscription = interval(60000).subscribe(() => {
  //    this.fetchCoordinates();
  //  });
}
