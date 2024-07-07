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

                this.previousUrl.next(this.currentUrl);
                localStorage.setItem('previousRouteUrl',this.currentUrl);
                this.currentUrl = event.url;
               
            };
        });

    }

    public getPreviousUrl() {
        let url = of(localStorage.getItem('previousRouteUrl'));
        return url;
    }

}