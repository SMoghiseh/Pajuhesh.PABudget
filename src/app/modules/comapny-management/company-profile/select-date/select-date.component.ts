import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { StaticYear, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent implements OnInit {
  // @Input() selectType = '';
  @Output() selectedVal = new EventEmitter<any>();
  @Input()
  set selectType(val: string) {
    this._selectType = val;
    if (this.selectTypeOld !== val) {
      this.getStaticYear();
      this.selectedYears = [];
    }
  }
  @Input()
  set tableYearSelected(val: any) {
    debugger;
  }

  // get selectType(): string {
  //   debugger;
  // }

  staticYearLst = [new StaticYear()];
  selectedYears: Array<number> = [];
  selectedYearId!: number;
  oldSelectedId!: number;
  selectTypeOld = '';
  _selectType = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    // this.getStaticYear();
  }

  getStaticYear() {
    this.selectTypeOld = this._selectType;
    this.httpService
      .get<StaticYear[]>(UrlBuilder.build(StaticYear.apiAddress + 'List', ''))
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [new StaticYear()];
        })
      )
      .subscribe(res => {
        res.forEach((element, index) => {
          if (index === 0) {
            this.selectedYears.push(element.id);
            this.oldSelectedId = element.id;
            this.selectedVal.emit(this.selectedYears);
            element.isSelected = true;
          } else element.isSelected = false;
        });
        this.staticYearLst = res;
      });
  }

  onSelectYear(id: number) {
    this.selectYearType(id);
  }

  selectYearType(id: number) {
    if (this._selectType === 'multiple') {
      const fltr = this.selectedYears.filter(x => x === id);
      this.staticYearLst.forEach(element => {
        if (element.id === id) {
          if (fltr.length === 0) {
            element.isSelected = true;
            this.selectedYears.push(element.id);
            this.selectedVal.emit(this.selectedYears);
          } else {
            element.isSelected = false;
            const index = this.selectedYears.indexOf(element.id);
            if (index > -1) this.selectedYears.splice(index, 1);
          }
        }
      });
      this.selectedVal.emit(this.selectedYears);
    } else {
      this.staticYearLst.forEach(element => {
        if (this.oldSelectedId && this.oldSelectedId === element.id)
          element.isSelected = false;
      });
      this.staticYearLst.forEach(element => {
        if (element.id === id) {
          element.isSelected = true;
          this.selectedVal.emit(id);
          this.selectedYearId = id;
          this.oldSelectedId = id;
        }
      });
    }
  }
}
