import { Component } from '@angular/core';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-company-management',
  templateUrl: './company-management.component.html',
})
export class CompanyManagementComponent {
  constructor(public animationService: AnimationService) { }
}
