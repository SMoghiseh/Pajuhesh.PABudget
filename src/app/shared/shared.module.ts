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
import { HeaderComponent } from '@core/layout/header/header.component';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { PasswordModule } from 'primeng/password';
import { ActiveTabsBarComponent } from '@core/layout/active-tabs-bar/active-tabs-bar.component';
import { FooterComponent } from '@core/layout/footer/footer.component';
import { LoadingElementComponent } from '@core/layout/loading-element/loading-element.component';
import { PageNotFoundComponent } from '@core/layout/page-not-found/page-not-found.component';
import { SidemenuComponent } from '@core/layout/sidemenu/sidemenu.component';
import { MainComponent } from '@core/main/main.component';

@NgModule({
  declarations: [
    IRCurrencyPipe,
    FaNumPipe,
    EnNumPipe,
    JDatePipe,
    CalendarComponent,
    JyearPipe,
    JdayPipe,
    HasPermissionsDirective,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    SidemenuComponent,
    MainComponent,
    LoadingElementComponent,
    ActiveTabsBarComponent,],
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
    MenuModule,
    DialogModule,
    ButtonModule,
    TooltipModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    ToolbarModule,
    RippleModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule],
  exports: [
    IRCurrencyPipe,
    FaNumPipe,
    EnNumPipe,
    JDatePipe,
    CalendarComponent,
    JyearPipe,
    JdayPipe,
    HasPermissionsDirective,
    HeaderComponent
  ],
  providers: [TransferServices],
})
export class SharedModule { }
