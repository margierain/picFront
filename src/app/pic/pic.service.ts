import { Injectable } from '@angular/core';
import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';
import {Observable} from 'rxjs/observable';
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ImageFields } from './photo';
import { FolderField } from './file';

const backend_url = 'http://localhost:8000/'
//'https://picfront.herokuapp.com/'
//http://localhost:8000/

@Injectable()
export class ImageService {

    constructor(private http: Http) {

    }


    // Api call to upload image
    getImages(): Observable<ImageFields[]> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
        return this.http.get(backend_url + 'api/images/',
            {headers: headers, body: ''})
        .map(res => {
            console.log('getImages', res.json());
            return res.json();
         })
        .catch(err => err)

    }
    // Api call to upload image
    getImagesInFolder(fid:number, pid:number): Observable<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
        return this.http.get(backend_url + 'api/folders/' +  fid + '/images/' + pid + '/',
            {headers: headers, body: ''})
        .map(res => {
            console.log('folder', res.json());
            return res.json();
         })
        .catch(err => err)

    }

    // Api call to upload image
    getSingleImage(pid: number): Observable<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
        return this.http.get(backend_url + 'api/images/' +  pid + '/',
            {headers: headers, body: ''})
        .map(res => {
            console.log('Single', res.json());
            var singleImage = res.json();
            singleImage.edited_image += '?' + Math.random();
            return singleImage;
         })
        .catch(err => err)

    }
    resetImage(pid: number) {
      var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
        return this.http.get(backend_url + 'api/images/' +  pid + '/',
            {headers: headers, body: ''})
        .map(res => {
            console.log('Single', res.json());
            var singleImage = res.json();
            singleImage.edited_image += '?' + Math.random();
            return singleImage;
         })
        .catch(err => err)

    }
     
    

  createFolder(folder: string) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.post(backend_url + 'api/folders/', JSON.stringify({ "name": folder }), {

      headers: headers
    })
      .map(res => res.json())

  }
  getFolders(): Observable<FolderField[]>  {

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.get(backend_url + 'api/folders/', {headers: headers, body: ''})
      .map(res => res.json())
      .catch(err => err)

  }

  // Api call to update folder name
  updatefolder(name: string, fid: number): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.put(backend_url + 'api/folders/' + fid + '/', JSON.stringify({ 'name': name}), {
      headers: headers
    })
      .map(res => res.json());
  }

  deleteImages(Imageid: number): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    console.log('jfk');
    return this.http.delete(backend_url + 'api/images/' + Imageid + '/', {
      headers: headers, body: ''});
  }

 
  // Api call to delete a folder
  deletefolder(bid: number): Observable<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.delete(backend_url + 'api/folders/' + bid + '/', {
      headers: headers, body: ''});
  }

  imageEffects(pic:any, pid: number, apply: string, effect: string ):Observable<any>  {
    var photo = {}
    photo[apply] = effect
    var data = {"effects":  JSON.stringify(photo)}
    console.log('me',data)
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.put(
      backend_url + 'api/images/' + pid + '/', data, {headers: headers }
    ).map(res => {
            console.log('Image', res.json());
            return res.json();
         })
  }

  imageTranformation(pic:any, pid: number, transform:string, effect: string, apply: string):Observable<any>  {
    console.log('number', transform, effect)
    var photo = {}
    photo[apply] = [effect, transform,]
    var data = {"effects":  JSON.stringify(photo) }
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer facebook ' + localStorage.getItem('fb_token'));
    return this.http.put(
      backend_url + 'api/images/' + pid + '/', data, {headers: headers }
    ).map(res => {
            console.log('Image', res.json());
            return res.json();
         })
  }
}