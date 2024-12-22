import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { SpinnerService } from '@shared/services/spinner.service';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule],
  providers: [SpinnerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
