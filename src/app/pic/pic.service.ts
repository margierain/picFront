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
            console.log('DATA', res.json());
            return res.json();
         })
        .catch(err => err)

    }

    createImage(image: any) {
        console.log(image, 'idhuidkd')
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
  imageEffects(pic:any, pid: number, apply: string, effect: string ):Observable<any>  {
    console.log('number', pid)
    console.log(apply, effect)
    var photo = {}
    photo[apply] = effect
    console.log('photo', photo)
    var data = {"effects":  JSON.stringify(photo) }
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log('data', data )
    return this.http.put(
      'http://localhost:8000/api/images/' + pid + '/', data, {headers: headers }
    ).map(res => {
            console.log('Image', res.json());
            return res.json();
         })
  }

  imageTranformation(pic:any, pid: number, transform:string, effect: string, apply: string):Observable<any>  {
    console.log('number', apply, pic)
    var photo = {}
    photo[apply] = [transform, effect]
    var data = {"effects":  JSON.stringify(photo) }
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log('datas', data )
    return this.http.put(
      'http://localhost:8000/api/images/' + pid + '/', data, {headers: headers }
    ).map(res => {
            console.log('Image', res.json());
            return res.json();
         })
  }
}