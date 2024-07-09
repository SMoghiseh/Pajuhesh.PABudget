import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

@Injectable()
export class PreviousRouteService {

    public previousUrl: BehaviorSubject<string> = new BehaviorSubject('');
    private currentUrl = '';

    constructor(private router: Router) {

        this.currentUrl = this.router.url;

        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {

                // set previous url from last value state
                this.previousUrl.next(this.currentUrl);
                localStorage.setItem('previousRouteUrl', this.currentUrl);
                // set current  route as current url
                if (this.currentUrl == '/') // happen just from dashboard to another route
                    this.currentUrl = '/default/Dashboard'
                else
                    this.currentUrl = event.url;
            };
        });

    }

    public getPreviousUrl() {
        debugger
        let url = of(localStorage.getItem('previousRouteUrl'));
        return url;
    }

}