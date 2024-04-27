import { Component, HostListener, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  Event,
  RouterEvent,
} from '@angular/router';

import { SidemenuService } from '@core/layout/sidemenu/sidemenu.service';

import { fadeInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [fadeInAnimation],
  providers: [AnimationService],
})
export class MainComponent implements OnInit {
  /** Components loading. */
  loading = false;

  /** Width of the screen. */
  innerWidth!: number;

  isShowMenu = false;

  constructor(
    private router: Router,
    public animationService: AnimationService,
    public sidemenuService: SidemenuService,
    private messageService: MessageService
  ) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.sidemenuService.menu.next(
            (event as RouterEvent).url.split('/')[1]
          );
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngOnInit(): void {
    this.isShowMenu = this.showMenu();
    this.innerWidth = window.innerWidth;
    this.offcanvasModeDetection(window.innerWidth);
  }

  /** Get width of the screen */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.offcanvasModeDetection(window.innerWidth);
  }

  /**
   * Detect sidemenu offcanvas mode.
   * @param innerWidth windows width
   */
  private offcanvasModeDetection(innerWidth: number) {
    if (innerWidth < 991) this.sidemenuService.offcanvasMode = true;
    else this.sidemenuService.offcanvasMode = false;
  }

  showMenu() {
    const sessionStorageMenuItems = localStorage.getItem('MENU');
    const localStorageMenuItems = localStorage.getItem('MENU');
    let menuItems: any;
    if (sessionStorageMenuItems)
      menuItems = JSON.parse(sessionStorageMenuItems);
    else if (localStorageMenuItems)
      menuItems = JSON.parse(localStorageMenuItems);

    let fltr;
    if (menuItems.length > 0)
      fltr = menuItems.filter((x: any) => x.isHidden == false);
    if (fltr.length > 0) return true;
    else return false;
  }
}
