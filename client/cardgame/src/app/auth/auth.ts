import { Injectable } from '@angular/core';

import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';

import { AuthenticationService } from './authentication.service';


@Injectable()
export class AuthGuard implements CanActivate {
    
  constructor(
      public router: Router,
      public authenticationService: AuthenticationService) 
   {}
  
  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.authenticationService.isLogged().then((logged)=>{
        if (logged) {
            return this.checkUserRole(route);
        } else {
            console.log("redirected from: ",route.toString());
            this.router.navigate(['/login'],{ 
                queryParams: { 
                    next: route.url 
                } 
            });
            return false;
        }
    });
  }
  
  checkUserRole(route: ActivatedRouteSnapshot): boolean {
        let authRole = route.data.authRole;
        if (authRole) {
            let user = this.authenticationService.getNowLoggedUser();
            if (user.roles && user.roles.indexOf(authRole)!==-1) {
                return true;
            } 
            console.error("Ruolo richiesto ",authRole);
            return false;
        } else {
            return true;
        }
  }
  
}
