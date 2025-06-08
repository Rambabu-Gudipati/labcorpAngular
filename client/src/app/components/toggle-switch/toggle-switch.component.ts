import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  template: `
    <input type="checkbox" id="toggle-button-checkbox" [checked]="on"
      (change)="emit($event.target)">
    <label class="toggle-button-switch"  [class.primary]="on"  
      for="toggle-button-checkbox"></label>
      
      <div class="toggle-button-text" [class.primary-text]="on">
        <div class="toggle-button-text-on">
          <ng-container *ngIf="showLabels && on">{{ leftText }}</ng-container>
        </div>
        <div class="toggle-button-text-off">
          <ng-container *ngIf="showLabels && !on">{{ rightText }}</ng-container>
        </div>
      </div>
    
  `,
  styles: [
    `
    :host {
      display: block;
      position: relative;
      width: 74px;
      height: auto;
    }
    
    input[type="checkbox"] {
      display: none; 
    }

    .toggle-button-switch {
      position: absolute;
      top: 4px;
      left: 4px;
      width: 24px;
      height: 24px;
      background-color: #757575;
      border: 1px solid #757575;
      border-radius: 100%;
      cursor: pointer;
      z-index: 100;
      transition: left 0.3s;
    }

    .primary {
      background-color: #fff;
      border: 1px solid #fff;
    }


    .toggle-button-text {
      border: 1px solid #757575;
      overflow: hidden;
      border-radius: 25px;
      min-height: 32px;
      transition: background-color 0.3s;
    }

    .primary-text {
      border: 1px solid #fff;
    }

    .toggle-button-text-on,
    .toggle-button-text-off {
      display: inline-block;
      width: 47%;
      height: 100%;
      line-height: 32px;
      font-family: Lato, sans-serif;
      font-weight: bold;
      text-align: center;
    }

    .toggle-button-text-off {
      color: #333;
    }
    .toggle-button-text-on {
      color: #fff;
      // padding-left: 3px
    }

    input[type="checkbox"]:checked ~ .toggle-button-switch {
      -webkit-transform: translateX(40px);
      -ms-transform: translateX(40px);
      transform: translateX(40px);
    }

    input[type="checkbox"]:checked ~ .toggle-button-text {
      background-color: #1275e8;
    }
  `,
  ],
})
export class ToggleButtonComponent {
  @Input() on: boolean;
  @Input() showLabels = true;
  @Input() leftText = 'Yes';
  @Input() rightText = 'No';
  @Output() changed = new EventEmitter<boolean>();

  emit($event: any): void {
    this.on = $event;
    this.changed.emit($event);
  }
}
