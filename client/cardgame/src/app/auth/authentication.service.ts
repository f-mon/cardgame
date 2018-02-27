import * as Rx from 'rxjs/Rx';

import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";

import { Injectable,Injector } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { EventBusService } from '../event-bus/event-bus.service';

@Injectable()
export class AuthenticationService {
    
    private loginObservable = new Rx.Subject<boolean>();
    private loggedUserObservable = new Rx.Subject<any>();
    private loggedUser: any = null;
    
    public gapi: any;
    public auth2: any;
    
    private authData = {
    	"web" : {
    		"client_id" : "884795039040-neh0j4tjgmgobf9voimkd1skp9fsiq5k.apps.googleusercontent.com",
    		"project_id" : "fmoon-sandbox",
    		"auth_uri" : "https://accounts.google.com/o/oauth2/auth",
    		"token_uri" : "https://accounts.google.com/o/oauth2/token",
    		"auth_provider_x509_cert_url" : "https://www.googleapis.com/oauth2/v1/certs",
    		"client_secret" : "LXoca48VkaDmwL_m4ED0tqp0",
    		"javascript_origins" : ["http://cardgame-f-mon.c9users.io:8082"]
    	}
    };
    
    constructor(
        public http: Http,
        private injector: Injector)  
    {    
       this.gapi = window['gapi'];
       this.initialize();
    }
    
    logout() {
        var auth2 = this.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
              console.log('User signed out.');
        });
    }
    
    isLogged(): Promise<boolean> {
        if (this.isLoggedNow()) {
            return Promise.resolve(true);
        }
        return new Promise<boolean>((resolve,reject)=>{
            this.loginObservable.map(val=>val).subscribe((val)=>{
              resolve(val);
            });    
        });
    }
    
    onLoggedUser(): Rx.Observable<any> {
        return this.loggedUserObservable;
    }
    
    getNowLoggedUser(): any {
        return this.loggedUser;
    }
    
    isLoggedNow(): boolean {
        return this.auth2 && (this.auth2.isSignedIn.get() === true);
    }
    
    private initialize() {
        this.gapi.load('auth2', ()=>{
           console.log("oauth2 loaded"); 
           
           this.gapi.auth2.init(this.authData.web).then(()=>{
               console.log("oauth2 initialized");
           },(e)=>{
               console.log("oauth2 init error",e);
           });
           this.auth2 = this.gapi.auth2.getAuthInstance();
           this.auth2.currentUser.listen((user)=>{
               if (this.auth2.isSignedIn.get()) {
                   this.onAuthenticationAvailable();
               } else {
                    this.onAuthenticationNotAvailable();
               }
              console.log('User now: ', user);
           });
           // Sign in the user if they are currently signed in.
           if (this.auth2.isSignedIn.get() === true) {
              this.auth2.signIn();
           }
       });
    }
    
    private onAuthenticationAvailable() {
        
        let googleUser = this.auth2.currentUser.get();
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;
        
        this.http.post(EventBusService.url+"/user/_login", {
            CLIENT_ID: this.authData.web.client_id,
            id_token: id_token
        }).map(res => {
            let jsonObj = res.json();
            console.log("/user/_login response ",jsonObj);
            return jsonObj;
        }).subscribe((appUser)=>{
            this.onUserLoginAvailable(appUser);
        });
    }
    
    private onAuthenticationNotAvailable() {
        
        
        this.onUserNotAvailable();
    }
    
    private onUserLoginAvailable(appUser) {
        this.loggedUser = appUser;
        this.loginObservable.next(true);
        this.loggedUserObservable.next(appUser);
    }
    
    private onUserNotAvailable() {
        this.loggedUser = null;
        this.loginObservable.next(false);
    }

}


