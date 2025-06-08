import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListYearlyScreenComponent } from './list-yearly-screen/list-yearly-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { YearlyscreenRoutingModule } from './yearlyscreen.routing.module';
import { AddYearlyscreenTestComponent } from './add-yearlyscreen-test/add-yearlyscreen-test.component';


@NgModule({
  declarations: [
    ListYearlyScreenComponent,
    AddYearlyscreenTestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
 YearlyscreenRoutingModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule, MultiSelectModule, DropdownModule,CalendarModule
  ]
})
export class YearlyscreenModule { }
