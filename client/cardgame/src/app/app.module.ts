import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule} from '@angular/http';
import { HttpClientModule} from '@angular/common/http';

import { LibMaterialModule } from './lib-material.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppNavigatorComponent } from './app-navigator/app-navigator.component';
import { AppHeaderComponent } from './app-header/app-header.component';

    
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    LibMaterialModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AppNavigatorComponent,
    AppHeaderComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
