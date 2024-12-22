import { Component } from '@angular/core';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="isLoading | async" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  isLoading = this.spinnerService.spinner$;

  constructor(private spinnerService: SpinnerService) {}
}
