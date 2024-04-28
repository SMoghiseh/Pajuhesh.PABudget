import { Component } from '@angular/core';
import { slideInAnimation } from '@shared/animations/transition.animation';
import { AnimationService } from '@shared/services/animation.service';

@Component({
  selector: 'marketwatch-document-settings',
  templateUrl: './document-settings.component.html',
  styles: [``],
  animations: [slideInAnimation],
  providers: [AnimationService],
})
export class DocumentSettingsComponent {
  constructor(public animationService: AnimationService) {}
}
