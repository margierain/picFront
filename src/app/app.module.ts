import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UPLOAD_DIRECTIVES } from 'ng2-uploader/ng2-uploader';
import { Ng2Bs3ModalModule,  ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { FbComponent } from './fb/fb.component';
import { PicComponent } from './pic/pic.component';
import { routing, appRouterProviders } from './app.route';
import { ImageService } from './pic/pic.service';
import { LoginGuard } from './login-guard.service';



@NgModule({
  declarations: [
    AppComponent, FbComponent, PicComponent, UPLOAD_DIRECTIVES,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    Ng2Bs3ModalModule ,
    
    

  ],
  providers: [Http, HTTP_PROVIDERS, ImageService, LoginGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
