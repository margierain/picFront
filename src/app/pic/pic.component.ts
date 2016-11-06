import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './pic.service';
import { ImageFields } from './photo';
import { FolderField } from './file';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';
import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ToastComponent } from '../shared/toast.component';

const URL = 'http://localhost:8000/api/images/';
//'https://picfront.herokuapp.com/'

var fb_token = localStorage.getItem('fb_token');

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css'],
  directives: [ModalComponent, ToastComponent],
  providers: [Ng2Bs3ModalModule ],
})

export class PicComponent implements OnInit {
   noimages = false;
   targetFolder: any;
   isInFolder:boolean = false;
   imageUrl:string;
   foldername: string;
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
   position: number = 0;

  uploadFile: any;
  imageDropped = false;
  uploadProgress: number;
  uploadResponse: Object;
  dropProgress: number = 0;
  dropResp: any[] = [];
  pos: any;
  server_url = "";
  not_editted:boolean = false;

  FOLDER_URL: any;


  @ViewChild(ToastComponent) toast: ToastComponent;
  toastMessage: string = '';

  options: Object = {
    url: URL,
    allowedExtensions: ['image/png', 'image/jpg', 'image/jpeg'],
    authToken: localStorage.getItem('fb_token'),
    authTokenPrefix: "Bearer facebook ",
    fieldName: 'image',
    data: {
       "name": ''
     }
 };


   @Input() avatar :any;
   @Input() username: string;
   @Input() images: ImageFields[];
   @Input() selectedImage: ImageFields;
   @Input() imagefield: ImageFields[];
   @Input() folders: FolderField[];
   @Input() selectedFolder: FolderField;
   @Input() folderimages: FolderField[];

   @Input() imagecount: number;
   @Input() folder: FolderField;


  constructor(private imageService:ImageService, private _router: Router, private slimLoadingBarService: SlimLoadingBarService) { }

  

  @ViewChild('editModal')
  editmodal: ModalComponent;

  @ViewChild('viewImage')
  viewimage: ModalComponent;

  onClose() {
    this.createFolder(this.foldername);
  };



  // set username and avatar
   ngOnInit() {
     var profPic = localStorage.getItem('profPic');
     var profName = localStorage.getItem('profName');
     

     if (profPic) {
       this.avatar = profPic;
       this.username = profName;
       this.noimages = true;
       this.fetchfolder()
       this.fetchImages()
       

     }
     else {
       console.log('not found')
     }
  }


  // Executed when an error occurs on Api call
  logError(err: any) {
    console.log('log error', err);
    
  }

  startLoading() {
        this.slimLoadingBarService.start(() => {
            
        });
    }


    stopLoading() {
        this.slimLoadingBarService.stop();
        
    }

    completeLoading() {
        this.slimLoadingBarService.complete();
    }


    fetchfolder() {
      this.imageService.getFolders().subscribe(
      data => this.onFolder(data),
      err => this.logError(err),
      () => console.log('Fetch folder')
    );
  }

  // Calls create folder service
  createFolder(form: any) {
    let foldername = this.foldername.trim();
    this.imageService.createFolder(foldername).subscribe(
      data => this.onCreateFolder(data),
      err => this.logError(err),
      () => console.log('Added successful')
    );

    this.foldername = '';
  }
 

  onCreateFolder(data:any) {

    this.fetchfolder()
    this.toastMessage = "Folder successfully created";
    this.toast.open();
    
  }

  // Service  call to fetch images
  fetchImages() {
    this.imageService.getImages().subscribe(
      data => this.onComplete(data),
      err => this.logError(err),
      () => console.log('fetch image')
    );
  }

  

  onSelectfolder(folder: FolderField, f: number) {
    this.imagecount = Object.keys(folder).length;
    if (this.imagecount > 0) {
      this.noimages = false;
    } else {
      this.noimages= true;
    }
    this.position = f;
  }


  deletefolder(folder:any) {
    this.imageService.deletefolder(folder.id).subscribe(
      data => this.onDeleteFolder(),
      err => this.logError(err),
      () => console.log('Delete folders')
      );
    this.toastMessage = "Folder successfully deleted";
    this.toast.open();

  }
  onDeleteFolder() {
    this.fetchfolder()

  }

  selectFolder(index) {
    // open modal
    this.pos = index;
    this.selectedFolder = this.folders[index];
    if(this.selectedFolder) {
      this.editmodal.open();
    }
   
  }

  editfolder(name:string, folder: any,) {
    if (name) {

    this.toastMessage = "Folder successfully updated";
    this.toast.open();
    this.imageService.updatefolder(name, folder.id).subscribe(
      data => this.onFolder(data),
      err => this.logError(err),
      () => console.log('Edit folder')
    );
    }
    this.toastMessage = "No folder updated";
    this.toast.open();
  }
  onEdit(image) {
    this.selectedImage = image
    this.validEdit(image)

  }
  
  onComplete(data:any) {
     if ((data).length === 0) {
       this.noimages = true;
       this.selectedImage = data

    } else {
      this.images = data
      this.selectedImage = data[this.index]
      this.validEdit(this.selectedImage)
      this.fetchEditedImage()
      this.noimages = false;
     

      
    }
  }

    validEdit (pic:any) {
      
      if(!pic['edited_image'] || (String(pic['edited_image']).indexOf('null')) === 0) {
         this.not_editted = true;
         this.edit_image = false;

      } 
      else {
         this.not_editted = false;
         this.edit_image = true;
      
     } 

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
      this.selectedImage = photo;
      this.index = s;
    }

    onFolderNameSelect(target) {
      if(this.isInFolder) {
        this.targetFolder = JSON.parse(target.value);
        this.FOLDER_URL = `http://localhost:8000/api/folders/${this.targetFolder.id}/images/`;
        this.options['url'] = this.FOLDER_URL;
        this.options['data'].name = this.targetFolder.name;
        this.options['data'].id = this.targetFolder.id;

      } else {
        this.options['url'] = URL;
        this.isInFolder = false;
      }
      
    }

    applyeffect(effects: string) {
      this.imageService.imageEffects( this.selectedImage,  this.selectedImage.id, this.filter, effects).subscribe(
      data => this.fetchEditedImage(),
      err => this.logError(err),
      () => this.completeLoading()
    );

    }
    applyTransformations(effects: string) {
      this.imageService.imageEffects(this.selectedImage, this.selectedImage.id, this.transform, effects).subscribe(
      data => this.fetchEditedImage(),
      err => this.logError(err),
      () => this.completeLoading()
    );

    }

    effectScale(value, transform_type:string) {
      this.imageService.imageTranformation(this.selectedImage, this.selectedImage.id, value, transform_type, this.enhance).subscribe(
        data => this.fetchEditedImage(),
        err => this.logError(err),
        () => this.completeLoading()
          );

        }
     effect(value, transform_type:string) {
      console.log('loading')
      this.imageService.imageTranformation(this.selectedImage, this.selectedImage.id, value, transform_type, this.effectRange).subscribe(
        data => this.fetchEditedImage(),
        err => this.logError(err),
        () => this.completeLoading()
          );

        }
    fetchEditedImage() {
      this.imageService.getSingleImage(this.selectedImage.id).subscribe(
      data => this.onEdit(data),
      err => this.logError(err),
      () => console.log('Complete')
    );
        }

    
     handleUpload(data): void {
       // select
      console.log('2. UPLOAD', data);
     this.imageDropped = true;
     this.uploadFile = data;
      
    if (data && data.response) {
      this.imageDropped = false;
      this.uploadProgress = 0;
      data = JSON.parse(data.response);
      this.uploadFile = data;
      this.onEdit(data)
      this.toastMessage = "Image successfully  uploaded";
      this.toast.open(); 
      this.completeLoading()   
    }
  }

  deleteImage(id:number) {
    this.imageService.deleteImages(id).subscribe(
       data => this.onDelete(),
      err => this.logError(err),
      () => console.log('Image deleted')
    );
  }

  onDelete() {
    this.imageService.getImages().subscribe(
      data => this.onDeleteComplete(data),
      err => this.logError(err),
      () => console.log('Completesd')
    );
  }

  onDeleteComplete(data:any) {
    this.images = data
    var num = Object.keys(data).length;
    if (num > 0) {
      console.log(data, 'deleted', data[this.index])
      this.noimages = false;
      this.selectedImage = data[this.index]
      this.validEdit(this.selectedImage)
    }
    else {
      console.log(data, 'deletedd')
      this.noimages = true;
      this.selectedImage = data
      this.validEdit(this.selectedImage)
    }


  }
  

  logOut() {
    localStorage.removeItem('fb_token');
    this._router.navigate(['/']);
  }
  shareImage() {
    console.log('sharelog',this.selectedImage)
    FB.ui({
      method: 'share',
      href: this.selectedImage.edited_image,
      picture: this.selectedImage.edited_image
    }, function (response) { });
  }

  showDetails(pic) {
    // console.log('mimi', pic)
  }
  folderPhotoes(folderimages) {
    console.log(folderimages, 'bmcv')

  }

  resetImage(pid:any) {
    this.imageService.resetImage(pid).subscribe(
      data => this.onReset(),
      err => this.logError(err),
      () => console.log('Completesd')
    );
  }

  onReset() {
    console.log('reset')
    this.fetchImages()
  } 

}
