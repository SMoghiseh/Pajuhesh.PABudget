import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* components */
import { CalendarComponent } from './components/calendar/calendar.component';

/* pipes */
import { IRCurrencyPipe } from './pipes/ircurrency.pipe';
import { FaNumPipe } from './pipes/fa-num.pipe';
import { EnNumPipe } from './pipes/en-num.pipe';
import { JDatePipe } from './pipes/jdate.pipe';
import { JyearPipe } from './pipes/jyear.pipe';
import { JdayPipe } from './pipes/jday.pipe';

/* PrimeNG */
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

import { HasPermissionsDirective } from './directives/has-permissions.directive';
import { TransferServices } from 'src/app/config.service';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    IRCurrencyPipe,
    FaNumPipe,
    EnNumPipe,
    JDatePipe,
    CalendarComponent,
    JyearPipe,
    JdayPipe,
    HasPermissionsDirective],
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    TableModule,
    DialogModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputTextareaModule,
    FileUploadModule,
    ProgressSpinnerModule,
    TooltipModule,
    PdfViewerModule,
    InputNumberModule,
  ],
  exports: [
    IRCurrencyPipe,
    FaNumPipe,
    EnNumPipe,
    JDatePipe,
    CalendarComponent,
    JyearPipe,
    JdayPipe,
    HasPermissionsDirective,
  ],
  providers: [TransferServices],
})
export class SharedModule { }
