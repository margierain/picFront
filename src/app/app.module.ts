import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { FileUploader } from 'ng2-file-upload';

import { Http, Headers, HTTP_PROVIDERS } from '@angular/http';
import { AppComponent } from './app.component';
import { FbComponent } from './fb/fb.component';
import { PicComponent } from './pic/pic.component';
import { routing, appRouterProviders } from './app.route';
import { ImageService } from './pic/pic.service';




@NgModule({
  declarations: [
    AppComponent, FbComponent, PicComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    // FileUploader,

  ],
  providers: [Http, HTTP_PROVIDERS, ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
