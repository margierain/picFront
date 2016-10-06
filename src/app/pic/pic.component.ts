import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {MdMenuModule} from '@angular2-material/menu';


import { ImageService } from './pic.service';
import { ImageFields } from './photo';
import { FolderField } from './file.ts';

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css'],
  directives: [],
  providers: [MdMenuModule],
})
export class PicComponent implements OnInit {
   foldername: string;
   noimages = false;
   index: number = 0;

   @Input() avatar :any;
   @Input() username: string;
   @Input() images: ImageFields[];
   @Input() selectedImage: ImageFields ;
   @Input() imagefield: ImageFields[];

  //  @Input() options: Object = {
  //   url: 'http://127.0.0.1:8000/' + '/api/images/',
  //   authToken: localStorage.getItem('id_token'),
  //   authTokenPrefix: "Bearer facebook ",
  //   fieldName: 'original_image'
  // };

  @Input() folder: FolderField[];

  constructor(private imageService:ImageService, private _router: Router ) { }

  // set username and avatar
   ngOnInit() {
     var profPic = localStorage.getItem('profPic');
     var profName = localStorage.getItem('profName')

     if (profPic) {
       this.avatar = profPic;
       this.username = profName;
       this.fetchImages()
       this.fetchfolder()
     }
     else {
       console.log('not found')
     }
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
    console.log('log error', err);
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
  // Service  call to fetch images
  fetchImages() {
    console.log("start fetch");
    this.imageService.getImages().subscribe(
      data => this.onComplete(data),
      err => this.logError(err),
      () => console.log('Complete')
    );
  }

  onComplete(data:any) {
    console.log('fetch image')
    this.images = data
    console.log(data[this.index].image)
    if ((this.images).length > 0) {
      this.noimages = false;


    } else {
      this.noimages = true;
      }
    }

    fetchfolder() {
      this.imageService.getFolders().subscribe(
      data => this.onFolder(data),
      err => this.logError(err),
      () => console.log('Complete')
    );
  }


    onFolder(data: any) {
      console.log('folder')
      console.log(data)
    }



}
