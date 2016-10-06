import { Injectable } from '@angular/core';
import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ImageFields } from './photo';
import { FolderField } from './file';


@Injectable()
export class ImageService {

    constructor(private http: Http) {

    }

    // Api call to upload image
    getImages(): Observable<ImageFields[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
        return this.http.get('http://localhost:8000/api/images/',
            {headers: headers, body: ''})
        .map(res => {
            // console.log('DATA', res.json());
            return res.json();
         })
        .catch(err => err)

    }

    createImage(image: any) {
        console.log(image)
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log(headers)
    return this.http.post('http://localhost:8000/api/images/', JSON.stringify({ "image": image }), {

      headers: headers
    })
     .map(res => {
            console.log('DATA', res.json());
            return res.json();
         })

  }

  createFolder(folder: string) {
        console.log(folder)
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log(headers)
    return this.http.post('http://localhost:8000/api/folders/', JSON.stringify({ "name": folder }), {

      headers: headers
    })
      .map(res => res.json())

  }
  getFolders(): Observable<FolderField[]>  {

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.get('http://localhost:8000/api/folders/', {headers: headers, body: ''})
      .map(res => res.json())
      .catch(err => err)

  }
}