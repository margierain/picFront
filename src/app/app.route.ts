import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FbComponent } from './fb/fb.component';
import { PicComponent } from './pic/pic.component';
import { AppComponent } from './app.component';
import { LoginGuard } from './login-guard.service';

const routes: Routes = [
  {path: 'home', component: PicComponent, canActivate: [LoginGuard] },
   {path: '', component: FbComponent },
  
];

export const appRouterProviders: any[] = [


];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);