import { Component } from '@angular/core';
import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class IndicatorComponent {
  constructor(public animationService: AnimationService) {}
}
