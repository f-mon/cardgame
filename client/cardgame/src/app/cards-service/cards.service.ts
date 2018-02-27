import * as Rx from 'rxjs/Rx';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { BoardModel,CellModel } from '../models/cardgame.model';
import { CardDefModel } from '../models/cards.model';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class CardsService {
    
    constructor(
        public http: Http
        ) 
    {
       
        
    }
    
    retrieveCardsDefinitions(): Rx.Observable<CardDefModel[]> {
        return this.http.post(EventBusService.url+"/cardsDefs", {moo:"foo",goo:"loo"})
            .map(res => {
                let jsonObj = res.json();
                console.log(jsonObj);
                return jsonObj;
            });
    }
    
    saveCardsDefinition(cardDefModel: CardDefModel): Rx.Observable<CardDefModel> {
        return this.http.post(EventBusService.url+"/cardsDefs/_save",cardDefModel)
            .map(res => {
                let jsonObj = res.json();
                console.log(jsonObj);
                return jsonObj;
            });
    }

}