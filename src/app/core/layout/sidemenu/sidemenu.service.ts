 

import { Injectable } from '@angular/core';
import { AuthService } from '@core/authentication/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { Permission } from '@shared/models/response.model';

@Injectable()
export class SidemenuService {
  /** Sidemenu state. */
  private state = true;

  /** Sidemenu menu name. */
  menu = new BehaviorSubject<string>('');

  /** Sidemenu menu items. */
  menuItems = new Subject<Permission[]>();

  private _offcanvasMode = false;
  /** Sidemenu offcanvas mode status. */
  get offcanvasMode() {
    return this._offcanvasMode;
  }
  set offcanvasMode(value: boolean) {
    if (value) this.close();
    else if (this.authService.getAccess()) {
      this.menu.next(this.menu.getValue());
      this.open();
    }

    this._offcanvasMode = value;
  }

  constructor(private authService: AuthService) {}

  /** Close sidemenu. */
  close() {
    this.state = true;
  }

  /** Open sidemenu. */
  open() {
    this.state = false;
  }

  /** Sidemenu close state. */
  isClose() {
    return this.state;
  }
}
