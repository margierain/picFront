import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from './pic.service';
import { ImageFields } from './photo';
import { FolderField } from './file.ts';

import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';
import { Ng2Bs3ModalModule, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ToastComponent } from '../shared/toast.component';

const URL = 'http://localhost:8000/api/images/';
// const FOLDER_URL = 'http://localhost:8000/api/folders/' + this.selectedFolderName.id + '/images/';
// console.log('url', FOLDER_URL)

var fb_token = localStorage.getItem('fb_token');

@Component({
  selector: 'app-pic',
  templateUrl: './pic.component.html',
  styleUrls: ['./pic.component.css'],
  directives: [ModalComponent, ToastComponent],
  providers: [Ng2Bs3ModalModule ],
})

export class PicComponent implements OnInit {
   selectedFolderName: any;
   isInFolder:boolean = false;
   imageUrl:string;
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

  FOLDER_URL: any = 'http://localhost:8000/api/folders/' + this.selectedFolderName + '/images/';


  @ViewChild(ToastComponent) toast: ToastComponent;
  toastMessage: string = '';

   @Input() options: Object = {
    url: URL,
    allowedExtensions: ['image/png', 'image/jpg', 'image/jpeg'],
    authToken: localStorage.getItem('fb_token'),
    authTokenPrefix: "Bearer facebook ",
    fieldName: 'image'
    // data: {
    //    "name": this.selectedFolderName
    //  },


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

   // @Input() public selectdeletefolder: Folder;
   // @Input() public selectdeleteImage: images;

  constructor(private imageService:ImageService, private _router: Router ) { }

  modalToggle = {
    open: () => this.open = true,
    close: () => this.open = false
  }

  otherToggle = {
    opens: () => this.opens = true,
    close: () => this.opens = false
  }

  @ViewChild('editModal')
  editmodal: ModalComponent;

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
    
  }
  // Calls create folder service
  createFolder(form) {
    let foldername = String(Object.values(form.value));

    console.log('FOLDERNAME', foldername);
    this.imageService.createFolder(foldername).subscribe(
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
    this.toastMessage = "Folder successfully created";
    this.toast.open();
    
  }

  // Service  call to fetch images
  fetchImages() {
    console.log("start fetch");
    this.imageService.getImages().subscribe(
      data => this.onComplete(data),
      err => this.logError(err),
      () => console.log('Completesd')
    );
  }

  

  onSelectfolder(folder: FolderField, f: number) {
    console.log('folder', folder, f)
    this.imagecount = Object.keys(folder).length;
    if (this.imagecount > 0) {
      this.noimages = false;
    } else {
      this.noimages= true;
    }
    this.position = f;
  }


  deletefolder(folder:any) {
    console.log(folder, 'del')
    this.imageService.deletefolder(folder.id).subscribe(
      data => this.onDeleteFolder(),
      err => this.logError(err),
      () => console.log('Completes')
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
    console.log('hfdh', folder, 'fdghjd', name)
    if (name) {

    this.toastMessage = "Folder successfully updated";
    this.toast.open();
    this.imageService.updatefolder(name, folder.id).subscribe(
      data => this.onFolder(data),
      err => this.logError(err),
      () => console.log('Completehjkl')
    );
    }
    this.toastMessage = "No folder updated";
    this.toast.open();
  }
  onEdit(image) {
    console.log('edit one', image)
    this.selectedImage = image
    this.validEdit(image)

  }
  
  onComplete(data:any) {
     if ((data).length === 0) {
       console.log('one')
       this.noimages = true;
       console.log('one',this.noimages)
       this.selectedImage = data

    } else {
      this.images = data
      this.selectedImage = data[this.index]
      this.validEdit(this.selectedImage)
      this.fetchEditedImage()
      this.noimages = false;
      // this.selectedImage = this.images[this.index - 1]

      
    }
  }

    validEdit (pic:any) {
      if(!pic['edited_image'] || (String(pic['edited_image']).indexOf('null')) === 0) {
        console.log('before')
         this.not_editted = true;
         this.edit_image = false;

      } 
      else {
        console.log('after')
         this.not_editted = false;
         this.edit_image = true;
      
     } 

    }

    fetchfolder() {
      this.imageService.getFolders().subscribe(
      data => this.onFolder(data),
      err => this.logError(err),
      () => console.log('Completehju')
    );
  }


    onFolder(data: any) {
      this.folders = data
      console.log('THE FOLDERS', data);
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

    onFolderNameSelect(target) {
      // debugger;
      this.selectedFolderName = target.value.name;
      let ok = target.value;
      console.log(ok);
    }

    inFolder(cb:any) {
      console.log('cb,' , cb)
      this.isInFolder = true;
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
      () => console.log('Completefill')
    );
        }

    
     handleUpload(data): void {
       // select
       console.log('UPLOAD', data);
     this.imageDropped = true;
     this.uploadFile = data;
      
    if (data && data.response) {
      console.log('in handle upload', data)
      this.imageDropped = false;
      this.uploadProgress = 0;
      data = JSON.parse(data.response);
      this.uploadFile = data;
      this.onEdit(data)
      this.toastMessage = "Image successfully  uploaded";
      this.toast.open();
      
     
     
    }
  }

  deleteImage(id:number) {
    console.log('mad', id)
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
    // console.log('mimi', pic)
  }

}
