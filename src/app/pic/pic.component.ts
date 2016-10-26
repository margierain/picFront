import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './pic.service';
import { ImageFields } from './photo';
import { FolderField } from './file.ts';

import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';
import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ToastComponent } from '../shared/toast.component';

const URL = 'http://localhost:8000/api/images/';
var fb_token = localStorage.getItem('fb_token');

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css'],
  directives: [ModalComponent, ToastComponent],
  providers: [Ng2Bs3ModalModule ],
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
   edit_image:boolean = false;
   open: boolean = false;
   opens: boolean = false;
   no_folder: boolean = false;

  uploadFile: any;
  imageDropped = false;
  uploadProgress: number;
  uploadResponse: Object;
  dropProgress: number = 0;
  dropResp: any[] = [];
  
  server_url = "";
  not_editted:boolean = false;

  @ViewChild(ToastComponent) toast: ToastComponent;
  toastMessage: string = '';

   
   @Input() options: Object = {
    url: URL,
    allowedExtensions: ['image/png', 'image/jpg', 'image/jpeg'],
    authToken: localStorage.getItem('fb_token'),
    authTokenPrefix: "Bearer facebook ",
    fieldName: 'image'
  };


   @Input() avatar :any;
   @Input() username: string;
   @Input() images: ImageFields[];
   @Input() selectedImage: ImageFields;
   @Input() imagefield: ImageFields[];
   @Input() folders: FolderField[];
   @Input() selectedFolder: FolderField;
   @Input() folderimages: FolderField[];



  @Input() folder: FolderField[];

  constructor(private imageService:ImageService, private _router: Router ) { }

  modalToggle = {
    open: () => this.open = true,
    close: () => this.open = false
  }

  otherToggle = {
    open: () => this.opens = true,
    close: () => this.opens = false
  }

  @ViewChild('editModal')
  editmodal: ModalComponent;

  onClose() {
    this.createFolder(this.foldername);
  }



  // set username and avatar
   ngOnInit() {
     var profPic = localStorage.getItem('profPic');
     var profName = localStorage.getItem('profName');
     

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
  // Calls create folder service
  createFolder(form) {
    console.log(form);
    let foldername = form.value;
    this.imageService.createFolder(foldername.folder).subscribe(
      data => this.onCreateFolder(data),
      err => this.logError(err),
      () => console.log('Added successful')
    );

    this.foldername = '';
  }
  // Retrieve photoes in a folder
  folderPhotoes(folder:any) {
    console.log('new', folder)

  }

  onCreateFolder(data:any) {

    this.fetchfolder()
    this.toastMessage = "successfully created folder";
    this.toast.open();
    // this.toasterService.pop('success', '', 'Folder successfully created');
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
  deletefolder() {

  }

  editfolder() {

  }


  onComplete(data:any) {
    console.log('here', data)
    this.images = data
    console.log(data)
    this.selectedImage = data[this.index]
    console.log('imj', this.selectedImage, (this.images).length)
    if ((this.images).length === 0) {
      this.noimages = true;

    } else {
      console.log('hapa')
      this.fetchEditedImage()
      this.noimages = false;
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
      this.folders = data
      if(data.length < 1) {
        this.no_folder = true;
      }
      else {
         this.no_folder = false;
      }

      
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
       console.log('kill', pic)
       this.selectedImage = pic
       this.modalToggle.close()
       if (pic['edited_image'] === null  || (pic['edited_image'].indexOf('null') > -1)) {
       
         console.log('pics ')
         this.not_editted = true;
         
       }
       
       else {
         console.log('editting')
         this.not_editted = false;
         this.edit_image = true;

       }
       

     }
     handleUpload(data): void {
     this.imageDropped = true;
     this.uploadFile = data;
      
    if (data && data.response) {

      this.imageDropped = false;
      this.uploadProgress = 0;
      data = JSON.parse(data.response);
      this.uploadFile = data;
      this.selectedImage = data;
      console.log('Image Uploaded', this.selectedImage )
      this.onEdit(data)
      // this.toasterService.pop('success', 'Success', 'Image successfully Uploaded');
      this.fetchImages() 
     
     
    }
  }

  logOut() {
    localStorage.removeItem('auth_token');
    this._router.navigate(['/']);
  }
  shareImage() {
    FB.ui({
      method: 'share',
      href: this.selectedImage.image,
      picture: this.selectedImage.image
    }, function (response) { });
  }

  showDetails(pic) {
    console.log('mimi')
  }

}
