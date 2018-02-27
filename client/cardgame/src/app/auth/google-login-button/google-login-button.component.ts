import {Observable} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Component,
  OnInit,
  NgZone,
  ElementRef,
  ContentChild,
  ViewChild,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss']
})
export class GoogleLoginButtonComponent implements OnInit,AfterViewInit {
  
  public signinBtnId: string;
  
  constructor(
    public authService: AuthenticationService
  ) {
    this.signinBtnId = "signinBtnId_"+(new Date().getTime());
  }
  
  ngOnInit() {
    
  }
  
  ngAfterViewInit() {
    this.authService.gapi.signin2.render(this.signinBtnId, {
      scope: 'email',
      width: 200,
      height: 50,
      longtitle: true,
      theme: 'dark'
    });
  }
  
}
