import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SosRoutingModule } from './sos.routing.module';
import { ViewSosComponent } from '../../components/view-sos/view-sos.component';

@NgModule({
  declarations: [
    ViewSosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SosRoutingModule,
    NgbToastModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SosModule {
  constructor() { }
}

