import * as Rx from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { BoardModel,CellModel } from '../models/cardgame.model';
import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class GameService {
    
    
    constructor(
        public http: Http,
        public eventBus: EventBusService
        ) 
    {
        
        setInterval(()=>{
            this.eventBus.fireEvent({
                name: 'CENTER_BOARD',
                cellX: Math.floor((Math.random()*100)),
                cellY: Math.floor((Math.random()*100))
            })
        },3000);
        
    }
    
    retrieveBoardModel(): Rx.Observable<BoardModel> {
        
        return this.http.post(EventBusService.url+"/gameBoard", {moo:"foo",goo:"loo"})
            .map(res => {
                let jsonObj = res.json();
                console.log(jsonObj);
                return BoardModel.createBoardModel(jsonObj);
            });
        
        /*
        return Rx.Observable.create(function(observer) {
            let board = BoardModel.createBoardModel(1000,1000); 
            observer.next(board);
        });
        */
    }

}