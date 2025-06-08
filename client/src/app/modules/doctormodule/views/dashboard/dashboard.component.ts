import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { DataService } from '../../../../services/data.service';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import { PatientDetailsComponent } from '../../patient-details/patient-details.component';
import { DayPilot, DayPilotCalendarComponent, DayPilotMonthComponent, DayPilotNavigatorComponent } from '@daypilot/daypilot-lite-angular';


@Component({
  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements AfterViewInit {
  rangeDates: Date[] | undefined;
  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();
  currentView: 'day' | 'week' | 'month' = 'day';
  // Current date format
  currentDateFormat: string = 'dd-MM-yy'; // Default to day view format
  items: any = {};
  currentDate: Date = new Date();
  contextMenu = new DayPilot.Menu({

  });
  onDateChange() {
    const selectedDate = new DayPilot.Date(this.currentDate); // Convert to DayPilot.Date

    this.configDay = {
      ...this.configDay,
      startDate: selectedDate,
    };

    this.configWeek = {
      ...this.configWeek,
      startDate: selectedDate,
    };

    this.configMonth = {
      ...this.configMonth,
      startDate: selectedDate,
    };
  }

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: () => {
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }


  configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    contextMenu: this.contextMenu,

    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: true,
    contextMenu: this.contextMenu,
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configMonth: DayPilot.MonthConfig = {
    contextMenu: this.contextMenu,
    eventBarVisible: false,
    onEventClick: this.onEventClick.bind(this),
  };


  constructor(private ds: DataService, private httpService: HttpClientService, private modalservice: NgbModal,private router: Router) {
    this.viewWeek();
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

  viewDay(): void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek(): void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;

  }

  viewMonth(): void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
  }

  onBeforeEventRender(args: any) {
    const dp = args.control;
    args.data.areas = [
      {
        top: 3,
        right: 3,
        width: 20,
        height: 20,
        symbol: "/icons/daypilot.svg#minichevron-down-2",
        fontColor: "#fff",
        toolTip: "Show context menu",
        action: "ContextMenu",
      },
      {
        top: 3,
        right: 25,
        width: 20,
        height: 20,
        symbol: "/icons/daypilot.svg#x-circle",
        fontColor: "#fff",
        action: "None",
        toolTip: "Delete event",
        onClick: async (args: any) => {
          dp.events.remove(args.source);
        }
      }
    ];

    args.data.areas.push({
      bottom: 5,
      left: 5,
      width: 36,
      height: 36,
      action: "None",
    });
  }

  onEventClick(args: any) {
    const data = args.e.data;
    const modalRef = this.modalservice.open(PatientDetailsComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.bookAppointment = this.items.find((item: { id: any; }) => item.id === data.id);
    modalRef.result.then((result) => {
      console.log(result);
      this.loadDataToCalender();
    }).catch((error) => {
      console.log(error);
      this.loadDataToCalender();
    });

  }


  ngOnInit(): void {
    console.log('Current Date:', this.currentDate);

    this.loadDataToCalender();
  }
  formattedDate(date: string, time: string) {
    return date.split('T')[0] + 'T' + time.replace('.', ':') + ':00';
  }
  formatToDate(date: string, time: string) {
    var newTime = Number(time) + 1;
    return date.split('T')[0] + 'T' + newTime.toString().replace('.', ':') + ':00:00';
  }

  loadDataToCalender() {
    this.httpService.getwithAuth(AppConstants.LIST_DOCTORS_IN_CALENDER).subscribe(res => {
      this.items = res.data;
      var eventList: any = [];
      for (let item of this.items) {
        var data = {
          id: item.id,
          text: item.booking_for.username,

          start: this.formattedDate(item.appointment_date, item.appointment_time_slot_name),
          end: this.formatToDate(item.appointment_date, item.appointment_time_slot_name),

        };
        eventList.push(data)
      }
      this.events = eventList;

    });

  }

 
  changeView(view: 'day' | 'week' | 'month'): void {
    this.currentView = view;

    // Update date format for each view
    switch (view) {
      case 'day':
        this.currentDateFormat = 'dd-MM-yy';
        break;
      case 'week':
        this.currentDateFormat = 'dd-MM-yy'; // Keep same format for week
        break;
      case 'month':
        this.currentDateFormat = 'MM-yy'; // Month format
        break;
    }

   
  }

  // Navigate through dates based on the view
  navigateDate(direction: number): void {
    const current = new Date(this.currentDate);

    switch (this.currentView) {
      case 'day':
        current.setDate(current.getDate() + direction); // Add/Subtract 1 day
        break;
      // case 'week':
      //   current.setDate(current.getDate() + direction * 7); // Add/Subtract 1 week
      //   break;
      case 'month':
        current.setMonth(current.getMonth() + direction); // Add/Subtract 1 month
        break;
    }

    this.currentDate = current; // Update the displayed date
    this.onDateChange(); // Call any necessary date change handler
  }


}
