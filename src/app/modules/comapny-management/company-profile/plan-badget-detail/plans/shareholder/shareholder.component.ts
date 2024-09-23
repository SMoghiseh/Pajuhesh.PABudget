import { Component, Input } from '@angular/core';

@Component({
  selector: 'PABudget-shareholder',
  templateUrl: './shareholder.component.html',
  styleUrls: ['./shareholder.component.scss']
})
export class ShareholderComponent {
  @Input() inputData: any;
}
