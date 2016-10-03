import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {UPLOAD_DIRECTIVES} from 'ng2-uploader/ng2-uploader';

import { ImageService } from './pic.service';
import { ImageFields } from './pic';
import { FolderField } from './folder.ts';

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css'],
  directives: [UPLOAD_DIRECTIVES ],
  providers: [],
})
export class PicComponent implements OnInit {
   foldername: string;

   @Input() options: Object = {
    url: 'http://127.0.0.1:8000/' + '/api/images/',
    authToken: localStorage.getItem('id_token'),
    authTokenPrefix: "Bearer facebook ",
    fieldName: 'original_image'
  };

  @Input() folder: FolderField[];

  constructor(private imageService:ImageService, private _router: Router ) { }

   ngOnInit() {
  }

   // Service called to upload image
  createImages(uploadPic: any) {
    console.log(uploadPic)
    console.log('hilly')
    this.imageService.createImage(uploadPic).subscribe(
      err => this.logError(err),
      () => console.log('Added successful')
    );

}
  // Executed when an error occurs on Api call
  logError(err: any) {
    console.log(err);
    // if (String(err['_body']).indexOf('unique') > 0) {
    //   this.toastr.error("Request not processed");
    // }
    // if (err['status'] == 403) {
    //   console.log(err['_body']);
    //   this._router.navigate(['']);
    // }
  }
  createFolder(foldername: string) {
    console.log('jill')
    console.log(foldername)
    this.imageService.createFolder(foldername).subscribe(
      data => this.onCreateFolder(),
      err => this.logError(err),
      () => console.log('Added successful')
    );


  }
  onCreateFolder() {
    console.log('folder created')
  }

}
