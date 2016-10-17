import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './pic.service';
import { ImageFields } from './photo';
import { FolderField } from './file.ts';
// import { FileUploader } from 'ng2-file-upload';

// upload url
const URL = 'http://localhost:8000/api/images/';

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css'],
  directives: [],
  providers: [],
})

export class PicComponent implements OnInit {
   foldername: string;
   noimages = false;
   index: number = 0;
   effects: string;
   filter = "filter";
   transform = "transform";
   enhance = "enhance";
   effectRange ="effect";
   edit_image: any;
   currentTime = Math.random();
   open: boolean = false;


   @Input() avatar :any;
   @Input() username: string;
   @Input() images: ImageFields[];
   @Input() selectedImage: ImageFields;
   @Input() imagefield: ImageFields[];
   // public uploader:FileUploader = new FileUploader({url: URL});



  @Input() folder: FolderField[];

  constructor(private imageService:ImageService, private _router: Router ) { }

  modalToggle = {
    open: () => this.open = true,
    close: () => this.open = false
  }
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
    console.log( err);
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
    this.images = data
    this.selectedImage = data[this.index]
    console.log('imj', this.selectedImage)
    console.log(data[this.index].image)
    if ((this.images).length > 0) {
      this.noimages = false;
      this.fetchEditedImage()

    } else {
      this.noimages = true;
      this.selectedImage = this.images[this.index - 1];
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

      console.log(data)
    }
    onselect(photo: ImageFields, s: number) {
      console.log(photo, s, 'onselect')
      this.selectedImage = photo;
      this.index = s;

    }
    applyeffect(effects: string) {
      this.imageService.imageEffects( this.selectedImage,  this.selectedImage.id, this.filter, effects).subscribe(
      data => this.fetchEditedImage(),
      err => this.logError(err),
      () => console.log('apply effects')
    );

    }
    applyTransformations(effects: string) {
      this.imageService.imageEffects(this.selectedImage, this.selectedImage.id, this.transform, effects).subscribe(
      data => this.fetchEditedImage(),
      err => this.logError(err),
      () => console.log('apply transform')
    );

    }

    effectScale(value, transform_type:string) {
      this.imageService.imageTranformation(this.selectedImage, this.selectedImage.id, value, transform_type, this.enhance).subscribe(
        data => this.fetchEditedImage(),
        err => this.logError(err),
        () => console.log('apply enhance')
          );

        }
     effect(value, transform_type:string) {
      console.log(value,  transform_type, 'scale')
      this.imageService.imageTranformation(this.selectedImage, this.selectedImage.id, value, transform_type, this.effectRange).subscribe(
        data => this.fetchEditedImage(),
        err => this.logError(err),
        () => console.log('apply enhance')
          );

        }
    fetchEditedImage() {
      this.imageService.getSingleImage(this.selectedImage.id).subscribe(
      data => this.onEdit(data),
      err => this.logError(err),
      () => console.log('Complete')
    );
        }

     onEdit(pic:any) {
       console.log('hill', pic)
       this.edit_image = pic

     }

}
