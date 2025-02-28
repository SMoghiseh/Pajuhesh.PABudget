import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-element',
  templateUrl: './loading-element.component.html',
  styleUrls: ['./loading-element.component.scss'],
})
export class LoadingElementComponent {
  /** Loading element visibility. */
  @Input() visible = false;
}
