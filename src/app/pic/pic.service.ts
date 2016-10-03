import { Injectable } from '@angular/core';
import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { ImageFields } from './pic';


@Injectable()
export class ImageService {

    constructor(private http: Http) {

    }

    // // Api call to upload image
    // getImages(): Observable<ImageFields[]> {
    //     var headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    //     return this.http.get('https://pimppic.herokuapp.com/api/images/', {
    //         headers: headers
    //     })
    //         .map(res => res.json());
    // }

    createImage(image: any) {
        console.log(image)
    image.preventDefault()
    // var fileUploadFormData = new image.FormData()
    // fileUploadFormData.append('uploaded_image', this.$els.fileinput.files[0])
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log(headers)
    return this.http.post('http://127.0.0.1:8000/api/images/', JSON.stringify({ "image": image }), {

      headers: headers
    })
      .map(res => res.json())

  }

  createFolder(folder: string) {
        console.log(folder)
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log(headers)
    return this.http.post('http://127.0.0.1:8000/api/folders/', JSON.stringify({ "name": folder }), {

      headers: headers
    })
      .map(res => res.json())

  }
}