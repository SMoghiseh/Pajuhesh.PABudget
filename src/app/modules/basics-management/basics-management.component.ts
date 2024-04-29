import { Component } from '@angular/core';

import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-basics-management',
  templateUrl: './basics-management.component.html',
  styleUrls: ['./basics-management.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class BasicsManagementComponent {
  constructor(public animationService: AnimationService) { }
}
