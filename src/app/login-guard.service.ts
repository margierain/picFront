import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class LoginGuard implements CanActivate {
	constructor(private router: Router) {
	}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		let token = localStorage.getItem('fb_token');
		let profile = localStorage.getItem('profPic');
		let name = localStorage.getItem('profName');
		if(token) if(profile) if(name) {
			return true;
		} else {
			this.router.navigate(['/']);
			return false;
		}
	}
}