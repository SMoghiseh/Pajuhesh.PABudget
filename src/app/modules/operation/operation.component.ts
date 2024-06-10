import { Component } from '@angular/core';
import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class OperationComponent {
  constructor(public animationService: AnimationService) {}
}
