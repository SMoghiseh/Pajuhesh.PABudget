import { Component } from '@angular/core';
import { fadeInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
  animations: [fadeInAnimation],
})
export class CompanyManagementComponent {
  constructor(public animationService: AnimationService) {}
}
