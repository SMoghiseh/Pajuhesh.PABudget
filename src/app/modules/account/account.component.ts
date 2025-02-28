import { Component } from '@angular/core';
import { fadeInAnimation } from '@shared/animations/transition.animation';

import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  animations: [fadeInAnimation],
  providers: [AnimationService],
})
export class AccountComponent {
  constructor(public animationService: AnimationService) {}
}
