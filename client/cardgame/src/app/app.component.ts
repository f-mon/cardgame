import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { 
  Router,
  ActivatedRoute,
  NavigationEnd
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  sidenavOpened: boolean = false;
  sidenavOpenable: boolean = false;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private iconRegistry: MatIconRegistry, 
    private sanitizer: DomSanitizer) 
  {
    this.iconRegistry.addSvgIconSet(this.sanitizer.bypassSecurityTrustResourceUrl('assets/game-iconSet.svg'));
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        if (event.showNavigator===false) {
          this.hideSidenav();
        } else {
          this.showSidenav();
        }
      });
  }
  
  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
  
  hideSidenav() {
    this.sidenavOpened = false;
    this.sidenavOpenable = false;
  }
  
  showSidenav() {
    this.sidenavOpened = true;
    this.sidenavOpenable = true;
  }
  
}
