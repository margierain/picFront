import { Component } from '@angular/core';

@Component({
	selector: 'toast',
	template: `
		<div class="toast" *ngIf="show">
		  <ng-content select="[toast-content]"></ng-content>
		</div>
	`,
	styles: [`
		.toast {
			position: fixed;
			top: 5%;
			left: 70%;
			width: 200px;
			height: 50px;
			background-color: blue;
			z-index: 100;
		}
	`]
})

export class ToastComponent {
	show: boolean = false;
	constructor() {}

	open() {
		this.show = true;

		setTimeout(() => {
			this.show = false;
		}, 3000);
	}
}