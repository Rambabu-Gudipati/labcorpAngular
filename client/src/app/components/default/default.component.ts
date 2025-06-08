import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Resolve, ResolveFn, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouteDataService } from '../../services/route-data.service';
import { HeaderComponent } from '../header/header.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent, HeaderComponent],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class DefaultComponent implements OnInit {

  page_title: string | Type<Resolve<string>> | ResolveFn<string> | undefined;
  constructor(private router: Router,
    private routeDataService: RouteDataService,
    private toastr: ToastrService,
    private title: Title) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(_ =>

        this.page_title = `${this.routeDataService.get()["title"]}`
      );
  }

}
