import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { StaticYear, UrlBuilder } from '@shared/models/response.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent {
  @Output() selectedVal = new EventEmitter<any>();
  @Input()
  set selectType(val: string) { debugger
    this._selectType = val;
    if (this.selectTypeOld !== val) {
      this.getStaticYear();
      this.selectedYears = [];
    }
  }

  staticYearLst = [new StaticYear()];
  selectedYears: any = [];
  selectedYearId!: number;
  oldSelectedId!: number;
  selectTypeOld = '';
  _selectType = '';

  constructor(private httpService: HttpService) {}

  getStaticYear() { debugger
    this.selectTypeOld = this._selectType;
    this.httpService
      .get<StaticYear[]>(StaticYear.apiAddress)
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
            if (this._selectType === 'multiple')
              this.selectedYears.push(element.id);
            else {
              this.selectedYears = element.id;
              this.oldSelectedId = element.id;
            }
            if (this._selectType === 'double') {
              this.selectedYears = [];
              const lastYearIndex = this.staticYearLst.findIndex(x => x.id);
              const Year = this.staticYearLst[lastYearIndex];
              const lastYear = this.staticYearLst[lastYearIndex + 1];
              lastYear.isSelected = true;
              this.selectedYears.push(Year.id);
              this.selectedYears.push(lastYear.id);
            }
            this.selectedVal.emit(this.selectedYears);
            element.isSelected = true;
          }
          if (index === 1 && this._selectType === 'double') {
            element.isSelected = true;
          }
        });
        this.staticYearLst = res;
      });
  }

  onSelectYear(id: number) { debugger
    this.selectYearType(id);
  }

  selectYearType(id: number) { debugger
    if (this._selectType === 'multiple') {
      const fltr = this.selectedYears.filter((x: any) => x === id);
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
    } else if (this._selectType === 'double') { debugger
      this.selectedYears = [];
      const yearIndex = this.staticYearLst.findIndex((x: any) => x.id == id);
      const isSelectedValue = this.staticYearLst[yearIndex].isSelected;
      if (isSelectedValue == true) {
        this.staticYearLst[yearIndex].isSelected = false;
      } else {
        for (let i = 0; i < this.staticYearLst.length; i++) {
          if (this.staticYearLst[i].isSelected === true)
            this.selectedYears.push(this.staticYearLst[i].id);
        }
        this.staticYearLst.forEach((element, index) => {
          const idIndex = this.staticYearLst.findIndex((x: any) => x.id == id);
          if (element.id === id && this.selectedYears.length < 2) {
            if (idIndex === index) {
              this.staticYearLst[idIndex].isSelected = true;
            } else false;
            this.selectedYears.push(element.id);
            console.log(this.selectedYears);
          }
        });
        this.selectedVal.emit(this.selectedYears);
      }
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
