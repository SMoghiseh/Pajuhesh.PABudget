import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  constructor(private _location: Location) {}
  backClicked() {
    this._location.back();
  }
}
