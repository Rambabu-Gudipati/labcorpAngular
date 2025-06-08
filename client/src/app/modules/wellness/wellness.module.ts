import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListWellnessPackageComponent } from './list-wellness-package/list-wellness-package.component';
import { WellnessRoutingModule } from './wellness.routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ViewPackageDetailsComponent } from './view-package-details/view-package-details.component';



@NgModule({
  declarations: [
    ListWellnessPackageComponent,
ViewPackageDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    WellnessRoutingModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule, MultiSelectModule, DropdownModule,CalendarModule
  ]
})
export class WellnessModule { }
