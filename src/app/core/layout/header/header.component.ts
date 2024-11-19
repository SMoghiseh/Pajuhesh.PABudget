import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication/auth.service';
import { StoredRoutesService } from '../../services/route-reuse-strategy/stored-routes.service';
import { ThemeService } from '../../services/theme.service';
import { SidemenuService } from '../sidemenu/sidemenu.service';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ConfirmationService],
})
export class HeaderComponent implements OnInit {
  @ViewChild('menu') menu: any;

  profileItems: MenuItem[] | undefined;
  loginData: any;
  currentApplicationVersion = '';
  _darkmode = false;
  visibleChangePass = false;
  defaultPath = '';
  get darkmode() {
    return this._darkmode;
  }
  set darkmode(value) {
    this._darkmode = value;

    this.toggleDarkMode(value);
  }

  constructor(
    public authService: AuthService,
    public sidemenuService: SidemenuService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private themeService: ThemeService,
    private storedRoutesService: StoredRoutesService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.darkmode = this.themeService.theme === 'light-theme' ? false : true;
    const loginData = localStorage.getItem('loginData');
    this.loginData = loginData ? JSON.parse(loginData) : {};
    this.currentApplicationVersion = environment.appVersion;
    this.profileItems = [
      {
        label: 'دریافت فایل راهنمای کاربری',
        icon: 'pi pi-book',
        iconClass: 'profile-iconClass',
        command: () => {
          this.onDownloadHelp();
        },
      },
      {
        label: 'اطلاعات کاربری',
        icon: 'pi pi-user-edit',
        iconClass: 'profile-iconClass',
        command: () => {
          this.onProfileInfo();
        },
      },
      {
        label: 'تغییر رمز ورود',
        icon: 'pi pi-lock',
        iconClass: 'profile-iconClass',
        command: () => {
          this.onChangePass();
        },
      },
      {
        label: 'خروج',
        icon: 'pi pi-sign-out',
        iconClass: 'profile-iconClass',
        command: () => {
          this.confirmSignout();
        },
      },
      {
        separator: true,
      },
      {
        label: 'نسخه : ' + environment.appVersion,
      },
    ];
  }

  /** Show sign out confirmation dialog */
  confirmSignout() {
    this.confirmationService.confirm({
      message: 'آیا برای خروج از حساب کاربری اطمینان دارید؟',
      icon: 'pi pi-user',
      acceptLabel: 'خروج',
      acceptButtonStyleClass: 'p-button-danger',
      acceptIcon: 'pi pi-power-off',
      rejectLabel: 'انصراف',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      accept: () => this.signout(),
    });
  }

  /** Sign out */
  signout() {
    this.storedRoutesService.clearStoredRoutes();
    this.sidemenuService.close();
    this.authService.logOut();
    this.router.navigate(['/account/login']);
  }

  /**
   *  Switch theme between dark and light mode
   * @param event event
   * @param theme theme's name
   * @param dark darkmode
   */
  private toggleDarkMode(darkmode: boolean) {
    if (darkmode) this.themeService.switchTheme('dark-theme');
    else this.themeService.switchTheme('light-theme');
  }
  onProfileInfo() {
    console.log('onProfileInfo');
  }

  onChangePass() {
    this.visibleChangePass = true;
  }

  onDownloadHelp() {
    const urlPDF = './assets/Helps/' + this.loginData.role + '.pdf';
    window.open(urlPDF, '_blank');
  }

  onBtnProfileClick(e: any, menu: any) {
    menu.toggle(e);
    console.log(e);
    e.clientX = 400;
  }
}
