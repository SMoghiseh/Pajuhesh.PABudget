import { Component, Input } from '@angular/core';
import { Report } from '@shared/models/response.model';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss'],
})
export class DocumentDetailComponent {
  @Input() selectedReport: Report = new Report();
}
