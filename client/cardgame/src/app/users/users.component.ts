import {Observable,Subscription} from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { 
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ElementRef,
  ContentChild,
  ViewChild,
  HostListener 
} from '@angular/core';
import {Router} from '@angular/router';
import { ScrollDispatcher,CdkScrollable } from '@angular/cdk/scrolling';

import { BoardModel,CellModel,ZoomFactor } from '../models/cardgame.model';
import { CardDefModel } from '../models/cards.model';

import { GameService } from '../game-service/game.service';
import { UsersService } from '../users-service/users.service';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit,OnDestroy {
  
  showUsers = [];
  
  private retrieveSub: Subscription;
  
  constructor(
    private ngZone: NgZone,
    private element: ElementRef,
    private router: Router,
    public usersService: UsersService
  ) {
  }
  
  ngOnInit() {
    this.retrieveSub = this.usersService.retrieveUsers().subscribe((users)=>{
      this.showUsers = users;
    });
  }
  
  ngOnDestroy() {
    if (this.retrieveSub) {
      this.retrieveSub.unsubscribe();
    }
  }
  
  onAddUser() {
    this.router.navigate(['/userEditor'])
  }

}

