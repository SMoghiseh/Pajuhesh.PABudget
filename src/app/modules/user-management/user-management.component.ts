import { Component } from '@angular/core';

import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class UserManagementComponent {
  constructor(public animationService: AnimationService) { }
}
