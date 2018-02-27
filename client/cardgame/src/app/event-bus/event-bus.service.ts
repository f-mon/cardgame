import * as Rx from 'rxjs/Rx';
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { BoardModel,CellModel } from '../models/cardgame.model';

@Injectable()
export class EventBusService {
    
    private _events = new Rx.Subject<any>();

    public static url: string = "https://cardgame-f-mon.c9users.io";
    public static wsUrl: string = "wss://cardgame-f-mon.c9users.io/";
    
    constructor(
        public http: Http
        ) 
    {
        this.initializeWsChannel();
    }

    get events(): Rx.Observable<any> {
        return this._events;
    }

    fireEvent(event: any) {
        this._events.next(event);
    }

    onEvent<T extends Function>(evenType: T): Rx.Observable<T> {
        return this._events.filter((ev) => {
            return ev instanceof evenType;
        })
    }
    
    onEventWithName(eventName: string): Rx.Observable<any> {
        return this._events.filter((ev) => {
            return ev.name === eventName;
        })
    }
    
    onServerMsgEvent(eventName: string): Rx.Observable<any> {
        return this._events.filter((ev) => {
            return ev.serverMsgEvent && (!eventName || eventName===ev.name);
        })
    }
    
    private propagateServerMessageEvent(eventJson: string) {
        let event = JSON.parse(eventJson);
        let servMsgEvt = Object.assign({
            serverMsgEvent: true
        },event);
        this.fireEvent(servMsgEvt);
    }

    private tryInitializeWsChannel(buffer?: number) {
        setTimeout(()=>{
            this.initializeWsChannel();
        },buffer || 2000);
    }
    
    private initializeWsChannel() {
        console.log('initializeWsChannel');
        let socket = new WebSocket(EventBusService.wsUrl);
        socket.addEventListener('error', (event)=>{
            console.log('Socket Error ',event);
        });
        socket.addEventListener('open', (event)=>{
            socket['_socketOpened'] = true;
            socket.send('Hello Server!');
        });
        socket.addEventListener('close', (event)=>{
            console.log('Socket closed');
            if (socket['_socketOpened']) {
                socket['_socketOpened'] = false;
                this.tryInitializeWsChannel();
            }
        });
        socket.addEventListener('message', (event)=>{
            console.log('Message from server ', event.data);
            this.propagateServerMessageEvent(event.data);
        });
        setTimeout(()=>{
            this.checkWsChannelOpened(socket);
        },3000);
    }
    
    private checkWsChannelOpened(socket) {
        if (socket['_socketOpened']) {
            return;
        } else {
            console.log('checkWsChannelOpened Abort and Retry');
            socket.close();
            this.tryInitializeWsChannel(5000);
        }
    }
    
}