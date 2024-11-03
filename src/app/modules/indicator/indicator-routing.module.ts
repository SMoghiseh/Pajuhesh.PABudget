import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorDefinitionComponent } from './indicator-definition/indicator-definition.component';
import { IndicatorComponent } from './indicator.component';
import { authGuard } from '@core/guards/auth/auth.guard';
import { IndicatorValueComponent } from './indicator-value/indicator-value.component';
import { IndicatorChartComponent } from './indicator-chart/indicator-chart.component';
import { IndicatorChartValueComponent } from './indicator-chart-value/indicator-chart-value.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorComponent,
    children: [
      {
        path: '',
        canMatch: [authGuard],
        children: [
          {
            path: 'CreateIndicator',
            component: IndicatorDefinitionComponent,
            title: 'برنامه و بودجه | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },

          {
            path: 'IndicatorValue/:id',
            component: IndicatorValueComponent,
            title: 'برنامه و بودجه | تعریف عناوین',
            data: {
              reuse: true,
              title: 'تعریف عناوین',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'CreateIndicatorChart',
            component: IndicatorChartComponent,
            title: 'برنامه و بودجه | تعریف شاخص',
            data: {
              reuse: true,
              title: 'تعریف شاخص',
              animation: 'SubjectDefinitionPage',
            },
          },
          {
            path: 'IndicatorChartValue/:id',
            component: IndicatorChartValueComponent,
            title: 'برنامه و بودجه | تعریف شاخص',
            data: {
              reuse: true,
              title: 'تعریف شاخص',
              animation: 'SubjectDefinitionPage',
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorRoutingModule { }
