/* بِسْمِ اللهِ الرَّحْمنِ الرَّحِیم */

import { Component } from '@angular/core';

import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-financial-expert',
  templateUrl: './financial-expert.component.html',
  styleUrls: ['./financial-expert.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class FinancialExpertComponent {
  constructor(public animationService: AnimationService) { }
}
