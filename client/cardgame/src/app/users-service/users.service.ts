import * as Rx from 'rxjs/Rx';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class UsersService {
    
    constructor(
        public http: Http
        ) 
    {
       
        
    }
    
    retrieveUsers(): Rx.Observable<any[]> {
        return this.http.post(EventBusService.url+"/users", {moo:"foo",goo:"loo"})
            .map(res => {
                let jsonObj = res.json();
                console.log(jsonObj);
                return jsonObj;
            });
    }
    
    saveUser(userUpdate: any): Rx.Observable<any> {
        return null;
    }

}