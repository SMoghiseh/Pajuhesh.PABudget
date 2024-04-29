import { Component, Input } from '@angular/core';
import { Report } from '@shared/models/response.model';

@Component({
  selector: 'app-advertisment-detail',
  templateUrl: './advertisment-detail.component.html',
  styleUrls: ['./advertisment-detail.component.scss'],
})
export class AdvertismentDetailComponent {
  @Input() selectedReport: Report = new Report();
}
