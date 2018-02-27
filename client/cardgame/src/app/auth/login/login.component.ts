import {Observable,Subscription} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Component,OnInit,NgZone,ElementRef,ContentChild,ViewChild,
  HostListener, 
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { 
  Router,
  ActivatedRoute
} from '@angular/router';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  
  private sub: Subscription;
  private authSub: Subscription;
  private next: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthenticationService,
    private ngZone: NgZone,
    private element: ElementRef
  ) {
  }

  ngOnInit() {
    this.authSub = this.authService.onLoggedUser().subscribe(user=>{
      this.nextPage();
    });
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.next = params['next'];
      });
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.authSub.unsubscribe();
  }

  nextPage() {
    if (this.next) {
      this.router.navigate(this.next);
    }
  }
  
  isLogged(): boolean {
    return this.authService.isLoggedNow();
  }
  
  signOut() {
    this.authService.logout();
  }
  
}
