/// <reference path="../../../fbsdk.d.ts" />


import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FBConnector } from './fb.service';
import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';

declare const FB: any;

@Component({
  selector: 'app-fb',
  templateUrl: './fb.component.html',
  styleUrls: ['fb.component.css'],
  providers: [Http, HTTP_PROVIDERS]
})
export class FbComponent implements OnInit {


  constructor(private http: Http, private router: Router) {};

 ngOnInit(){
    var fbCon: FBConnector = new FBConnector('1171930142882377');
    fbCon.initFB();
  }

    login() {
      let self = this;
    FB.login(function (response) {
      console.log('fb')
      console.log(response);
      status = response['status'];
     var userId = response['authResponse'].userID;
     if (status == 'connected') {

         FB.api(`/${userId}`, response => {
            localStorage.setItem('profName', response['name']);
          });

         FB.api(`/${userId}/picture`, response => {
            localStorage.setItem('profPic', response['data'].url);
        });

         let access_token = response['authResponse']['accessToken'];
          localStorage.setItem('fb_token', access_token);


     }
     else if (status === 'not_authorized') {
        console.log('unauth')
        document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
        this.router.navigate(['']);
     }
    }, {scope: 'public_profile', return_scopes: true});
}
   // store auth token on the browser
  onComplete(data:any) {
    console.log('on complete')
    localStorage.setItem('fb_token', data["token"]);
    this.router.navigate(['/home']);
  }
      // Execuit after failed authentication
    logError(err: any) {
      console.log('logerror')
      console.log(err)
    // this.correct = false;
    // this.userobj = JSON.parse(err["_body"]);
    // this.arrayOfKeys = Object.keys(this.userobj);
  }



}