import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fb',
  templateUrl: './fb.component.html',
  styleUrls: ['fb.component.css'],
  providers: [],
})
export class FbComponent implements OnInit {

  constructor( ) { }

  ngOnInit() {
  }
  public login() {
    console.log('mamaa');

 }
}
