import { Component, Input, OnInit } from '@angular/core';
import { AppConstants } from '../../../app-constants';
import { HttpClientService } from '../../../services/http-client-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-package-details',

  templateUrl: './view-package-details.component.html',
  styleUrl: './view-package-details.component.scss'
})
export class ViewPackageDetailsComponent implements OnInit{
  @Input() id: any = 0;
  items: any = {};
  constructor(private httpService: HttpClientService, private activeModal: NgbActiveModal) {
    
  }
  ngOnInit(): void {
    
    this.loadPackageDetails();
  }
  
  loadPackageDetails()
  {
    this.httpService.getwithAuth(AppConstants.GET_PACKAGES_BY_ID + '/' + this.id)
      .subscribe(res => {
        this.items = res.data;
       
      });

  }
  dismissModal()
  {
    this.activeModal.close();
  }
}
