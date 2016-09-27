/// <reference path="../../../fbsdk.d.ts" />


import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FBConnector } from './fb.service';

declare const FB: any;

@Component({
  selector: 'app-fb',
  templateUrl: './fb.component.html',
  styleUrls: ['fb.component.css'],
  providers: []
})
export class FbComponent implements OnInit {


  constructor(private router: Router) {};

 ngOnInit(){
    var fbCon: FBConnector = new FBConnector('1105738856140424');
    fbCon.initFB();
  }

    login() {
    FB.login(function (response) {
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

          // this.router.navigate(['/home']);
     }
     else if (status === 'not_authorized') {
         document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
     }
    }, {scope: 'public_profile', return_scopes: true});
}

}