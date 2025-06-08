import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SosReportsComponent } from './sos-reports/sos-reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';



@NgModule({
  declarations: [
    SosReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
      FormsModule,
     TableModule, ButtonModule, StyleClassModule, IconFieldModule,
        InputIconModule, InputTextModule, TagModule
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportsModule { }
