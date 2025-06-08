import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";


@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   if (this.authService.checkAuthentication()) {
  //     return true;
  //   } else {
  //     this.router.navigate(["/login"]);
  //     return false;
  //   }
  // }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles = next.data['roles'] as string[];
    if (this.authService.isAuthorized(allowedRoles)) {
      return true;
    } else {
      const hasUser = this.authService.getUserName();
      if (hasUser != null) {
        this.toastr.error("You dont have access to view this page. Please contact admin", "Not Authorized")
      }
    }

    // Redirect to the login page or some other route
    this.router.navigate(['/login']);
    return false;
  }
}

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = Inject(AuthService);
//   const router = Inject(Router);
//   const currentUser = authService.currentUserValue;
//   if (currentUser == null || currentUser == undefined) {
//     router.createUrlTree(['/auth/login'])
//     return false;
//   }
//   return true;
// };
