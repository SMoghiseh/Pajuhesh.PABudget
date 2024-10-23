import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http.service';
import { StrategySWOT } from '@shared/models/response.model';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'PABudget-swotstrategy',
  templateUrl: './swotstrategy.component.html',
  styleUrls: ['./swotstrategy.component.scss'],
  providers: [ConfirmationService],
})
export class SWOTStrategyComponent {
  SWOTStrategyForm!: FormGroup;
  strategyswotList: any = [];
  targetStrategyswot: any = [];

  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getStrategySWOTLst();
    this.SWOTStrategyForm = new FormGroup({
      title: new FormControl(),
    });
  }

  getStrategySWOTLst() {
    this.httpService
      .post<StrategySWOT[]>(StrategySWOT.apiAddress + 'List', {
        withOutPagination: true,
        planningValue: this.route.snapshot.paramMap.get('id'),
      })
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.strategyswotList = response.data.result;
        }
      });
  }

  sendStrategyswot(items: any) {
    const result = items.map((x: { id: any }) => x.id);
    const body = {
      swotIds: result,
      strategyId: this.route.snapshot.paramMap.get('visionId'),
    };
    this.httpService
      .post<StrategySWOT[]>(StrategySWOT.apiAddressStrategySwot + '', body)
      .subscribe(response => {
        if (response.data && response.data.result) {
          this.strategyswotList = response.data.result;
        }
      });
  }
}
