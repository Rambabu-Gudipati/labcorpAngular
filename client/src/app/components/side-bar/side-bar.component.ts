import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  standalone: true,
  imports: [RouterLink, CommonModule]
})
export class SideBarComponent implements OnInit {
  // [x: string]: any|string;
  userProfile: any
  constructor(private authService: AuthService,private router: Router) { }
  userRole: string = 'Admin'; // Example role, replace with actual logic
  openMenus: { [key: string]: boolean } = {}; // Track open/close state of menus

  // toggleMenu(menu: string): void {
  //   this.openMenus[menu] = !this.openMenus[menu];
  // }
  ngOnInit() {
    this.userProfile = JSON.parse(this.authService.getUserInfo());
    this.userRole = this.userProfile.role;
    this.activeMenu = this.router.url;
    
  }
  menus = [
    {
      label: 'Dashboard',
      icon: 'fa fa-dashboard',
      route: '/',
      subMenus: null,
    },
    {
      label: 'Masters',
      icon: 'fa fa-user',
      subMenus: [
        { label: 'User Management', route: '/masters/users' },
        { label: 'Hospitals', route: '/masters/hospitals' },
        { label: 'Doctors', route: '/masters/doctors' },
        { label: 'Ambulance', route: 'masters/ambulance' },
        { label: 'Care Team', route: 'masters/careTeam' },
        { label: 'Care Doctor', route: 'masters/careDoctor' },
        { label: 'Care Mentor', route: 'masters/careMentor' },
        { label: 'Map Users To Mentor', route: 'masters/mentorMapping' },
        { label: 'Diagnostic Labs', route: 'masters/lab' },
        { label: 'Configuration Data', route: 'masters/config' },
      ],
      isExpanded: false,
    },
    {
      label: 'Group Users',
      icon: 'fa fa-users',
      route: 'masters/group-users',
      subMenus: null,
    },
    {
      label: 'Group Center Users',
      icon: 'fa fa-sitemap',
      route: 'masters/group-center-users',
      subMenus: null,
    },
    {
      label: 'Advertisers',
      icon: 'fa fa-picture-o',
      route: 'advertiser/list-advertiser',
      subMenus: null,
    },
    {
      label: 'Inventory',
      icon: 'fa fa-microchip',

      subMenus: [
        { label: 'AID Devices', route: 'inventory/list-aid-device' },
        { label: 'ECG Devices', route: 'inventory/list-ecg' },
        { label: 'AID Issue', route: 'inventory/list-aid-issue' },
        { label: 'ECG Issue', route: 'inventory/list-ecg-issue' },
      ],
      isExpanded: false,
    },
    {
      label: 'Laboratory',
      icon: 'fa fa-microchip',

      subMenus: [
        { label: 'List Lab Test', route: 'lab/lab-test' },

      ],
      isExpanded: false,
    },
    {
      label: 'Reports',
      icon: 'fa fa-table',
      subMenus: [
        { label: 'SOS Reports', route: 'reports/view-reports' },
        { label: 'ECG Reports', route: '/reports/ecg' },
      ],
      isExpanded: false,
    },
    {
      label: 'Instant Meeting',
      icon: 'fa fa-video',
      route: 'meeting/join-meeting',
      subMenus: null,
    },
  ];
  mentors = [
    {
      label: ' Care Dashboard',
      icon: 'fa fa-dashboard',
      route: '/mentormodule/dashboard',
      subMenus: null,
    },

    {
      label: 'Lab Tests',
      icon: 'fa fa-users',
      route: '/mentormodule/orders',
      subMenus: null,
    },
    {
      label: 'Doctor Consultations',
      icon: 'fa fa-user-md',
      route: '/mentormodule/doctorconsultation',
      subMenus: null,
    },
    {
      label: 'Wellness Package',
      icon: 'fa fa-heart',
      route: '/wellness/list-wellness',
      subMenus: null,
    },
    {
      label: 'Instant Meeting',
      icon: 'fa fa-video',
      route: 'meeting/join-meeting',
      subMenus: null,
    },
    // {
    //   label: 'Yearly Screening',
    //   icon: 'fa fa-picture-o',
    //   route: '/mentormodule/order',
    //   subMenus: null,
    // },
    // {
    //   label: 'Health Details',
    //   icon: 'fa fa-picture-o',
    //   route: '/mentormodule/health-details',
    //   subMenus: null,
    // },
    {
      label: 'Mapping Users',
      icon: 'fa fa-picture-o',
      route: '/mentormodule/mappingusers',
      subMenus: null,
    },

  ];
  doctors = [
    {
      label: ' Doctor Dashboard',
      icon: 'fa fa-dashboard',
      route: '/doctor/dashboard',
      subMenus: null,
    },



  ];
  careteam = [
    {
      label: ' Care Team Dashboard',
      icon: 'fa fa-dashboard',
      route: '/',
      subMenus: null,
    },
    {
      label: 'Reports',
      icon: 'fa fa-table',
      subMenus: [
        { label: 'SOS Reports', route: 'reports/view-reports' },
        { label: 'ECG Reports', route: '/reports/ecg' },
      ],
      isExpanded: false,

    },

  ];
  activeMenu: string | null = null;
  activeSubMenu: string | null = null;

  // Toggle submenu
  toggleSubMenu(menu: any) {
    // If the clicked menu is already expanded, collapse it
    if (menu.isExpanded) {
      menu.isExpanded = false;
      this.activeMenu = null;
      this.activeSubMenu = null; // Clear active submenu
    } else {
      // Collapse all other menus and expand the clicked one
      this.menus.forEach((m) => (m.isExpanded = false));
      menu.isExpanded = true;
      this.activeMenu = menu.route;
      this.activeSubMenu = null; // Clear active submenu
    }
  }

  // Activate a menu item without a submenu
  setActiveMenu(menu: any) {
    // Collapse all expanded menus
    this.menus.forEach((m) => (m.isExpanded = false));
    this.activeMenu = menu.route;
    this.activeSubMenu = null; // Clear active submenu
  }

  // Activate a submenu item (inside Master, or any other submenu)
  setActiveSubMenu(menu: any, subMenu: any) {
    // Keep the parent menu open
    this.activeMenu = menu.route;
    this.activeSubMenu = subMenu.route;
  }
  isActive(route: string): boolean {
    return this.activeMenu === route || this.router.url === route;
  }
}