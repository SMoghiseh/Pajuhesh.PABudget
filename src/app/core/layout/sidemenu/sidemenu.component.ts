import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { AuthService } from '@core/authentication/auth.service';
import { SidemenuService } from './sidemenu.service';
import { Permission } from '@shared/models/response.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit, AfterViewInit {
  /** Side menu offcanvas mode state. */
  offcanvas = false;

  /** List of menus. */
  menuList: Permission[] = [];

  /** Current active menu name. */
  currentActiveMenu!: string;

  isShowNotFoundDialog = false;

  loginData: any;

  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  @ViewChildren('menuItemOffcanvas') menuItemsOffcanvas!: QueryList<ElementRef>;

  @ViewChildren('subMenuItem') subMenuItems!: QueryList<ElementRef>;
  @ViewChildren('subMenuItemOffcanvas')
  subMenuItemsOffcanvas!: QueryList<ElementRef>;

  /** Main width. */
  @Input() innerWidth!: number;

  /** Active route menu name */
  @Input() activeRouteMenuName!: string;

  constructor(
    private router: Router,
    public authService: AuthService,
    public sidemenuService: SidemenuService
  ) { }

  ngOnInit(): void {
    const loginData = localStorage.getItem('loginData');
    this.loginData = loginData ? JSON.parse(loginData) : {};
    this.menuList = this.getMenuItems();
  }

  ngAfterViewInit(): void {
    // Get menu items after login.
    this.sidemenuService.menuItems.subscribe(
      () => (this.menuList = this.getMenuItems())
    );

    // Expand active menu when login redirect user.
    this.sidemenuService.menu.subscribe(name => {
      this.collapseAllMenu();
      this.expandActiveMenu(name);
    });
  }

  /**
   * Get menu from storage.
   * @returns Menu items
   */
  private getMenuItems(): Permission[] {
    const sessionStorageMenuItems = localStorage.getItem('MENU');
    const localStorageMenuItems = localStorage.getItem('MENU');

    if (sessionStorageMenuItems) return JSON.parse(sessionStorageMenuItems);
    else if (localStorageMenuItems) return JSON.parse(localStorageMenuItems);
    else return [new Permission()];
  }

  /** Expand active route menu */
  private expandActiveMenu(name: string) {
    /* Normal Mode */
    const menuElement = this.menuItems.find(
      menuItem => menuItem.nativeElement['id'] === name
    );
    const subMenuElement = this.subMenuItems.find(
      menuItem => menuItem.nativeElement['id'].split('-')[2] === name
    );

    if (menuElement && subMenuElement) {
      menuElement.nativeElement.setAttribute('aria-expanded', 'true');
      menuElement.nativeElement.classList.remove('collapsed');

      subMenuElement.nativeElement.classList.remove('collapse');
      subMenuElement.nativeElement.classList.add('show');
    }

    /* Offcanvas Mode */
    const menuElementOffcanvas = this.menuItemsOffcanvas.find(
      menuItem => menuItem.nativeElement['id'] === name
    );
    const subMenuElementOffcanvas = this.subMenuItemsOffcanvas.find(
      menuItem => menuItem.nativeElement['id'].split('-')[2] === name
    );

    if (menuElementOffcanvas && subMenuElementOffcanvas) {
      menuElementOffcanvas.nativeElement.setAttribute('aria-expanded', 'true');
      menuElementOffcanvas.nativeElement.classList.remove('collapsed');

      subMenuElementOffcanvas.nativeElement.classList.remove('collapse');
      subMenuElementOffcanvas.nativeElement.classList.add('show');
    }
  }

  /** Collapse active route menu */
  private collapseAllMenu() {
    /* Normal Mode */
    this.menuItems.forEach(menuElement => {
      menuElement.nativeElement.setAttribute('aria-expanded', 'false');
      menuElement.nativeElement.classList.add('collapsed');
    });

    this.subMenuItems.forEach(subMenuElement => {
      subMenuElement.nativeElement.classList.add('collapse');
      subMenuElement.nativeElement.classList.remove('show');
    });

    /* Offcanvas Mode */
    this.menuItemsOffcanvas.forEach(menuElementOffcanvas => {
      menuElementOffcanvas.nativeElement.setAttribute('aria-expanded', 'false');
      menuElementOffcanvas.nativeElement.classList.add('collapsed');
    });

    this.subMenuItemsOffcanvas.forEach(subMenuElementOffcanvas => {
      subMenuElementOffcanvas.nativeElement.classList.add('collapse');
      subMenuElementOffcanvas.nativeElement.classList.remove('show');
    });
  }

  onSelectedMenu(path: string, underCons: any, icon: string) {
    if (underCons) {
      this.isShowNotFoundDialog = true;
    } else this.router.navigate([path]);
    const el = document.getElementsByClassName(icon);
    const elSelect = document.getElementsByClassName('e-select');
    if (elSelect.length > 0) {
      for (let i = 0; i < elSelect.length; i++) {
        elSelect[i].classList.remove('e-select');
      }
    }
    if (!el[0].querySelector('e-select')) el[0].classList.add('e-select');
  }

  onSubmit() {
    // const menuElement = document.getElementById('offcanvasRight');
    // menuElement?.classList.remove('show');
    // const fadeElement = document.getElementsByClassName('fade');
    // fadeElement[0]?.remove();
    // const closedElement = document.getElementsByClassName(
    //   'toggle-panel-button'
    // );
    // if (closedElement[0]?.classList.contains('closed'))
    //   this.sidemenuService.open();
    // else this.sidemenuService.close();
    //   closedElement[0]?.classList.remove('closed');
    // else closedElement[0]?.classList.add('closed');
    // this.sidemenuService.close();
    // this.sidemenuService.isClose();
    // fadeElement[0]?.classList.add('un-fade-manu');
  }

  onClick() {
    if (this.sidemenuService.isClose()) this.sidemenuService.open();
    else this.sidemenuService.close();
  }

  onClickParentMenu(data: string) {
    if (data == 'dashboard') {
      let url = '';
      if (
        this.loginData.mainRole == 'CEO' ||
        this.loginData.mainRole == 'Administrator'
      )
        url = '/default/CEO/landing';
      else url = '/default' + '/' + this.loginData.mainRole + '/' + data;
      this.router.navigate([url]);
    } else if (data == 'adrvers') this.router.navigate(['/default/home']);
    else if (data == 'Adverts') this.router.navigate(['/Publisher/Adverts']);
  }
}
