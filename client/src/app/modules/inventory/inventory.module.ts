import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddAidDevicesComponent } from './add-aid-devices/add-aid-devices.component';
import { ListAidDevicesComponent } from './list-aid-devices/list-aid-devices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { InventoryRoutingModule } from './inventory.routing.module';
import { NgToggleModule } from 'ng-toggle-button';
import { AddEcgComponent } from './add-ecg/add-ecg.component';
import { ListEcgComponent } from './list-ecg/list-ecg.component';
import { AddAidIssueComponent } from './issue/add-aid-issue/add-aid-issue.component';
import { ListAidIssueComponent } from './issue/list-aid-issue/list-aid-issue.component';
import { AddEcgIssueComponent } from './issue/add-ecg-issue/add-ecg-issue.component';
import { ListEcgIssueComponent } from './issue/list-ecg-issue/list-ecg-issue.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    ReactiveFormsModule,

    InventoryRoutingModule, NgToggleModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule
  ],
  declarations: [
    ListAidDevicesComponent,
    AddAidDevicesComponent,
    AddEcgComponent,
    ListEcgComponent,
    AddAidIssueComponent,
    ListAidIssueComponent,
    AddEcgIssueComponent,
    ListEcgIssueComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryModule { }
