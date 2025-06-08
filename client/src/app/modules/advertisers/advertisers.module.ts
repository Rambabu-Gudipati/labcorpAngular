import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisersRoutingModule } from './advertisers.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgToggleModule } from 'ng-toggle-button';
import { AddAdvertiserComponent } from './add-advertiser/add-advertiser.component';
import { ListAdvertisersComponent } from './list-advertisers/list-advertisers.component';
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
    AdvertisersRoutingModule, NgToggleModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule
  ],
  declarations: [AddAdvertiserComponent, ListAdvertisersComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdvertisersModule { }
