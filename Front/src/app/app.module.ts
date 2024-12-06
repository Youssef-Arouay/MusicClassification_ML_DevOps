import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FileUploadVGG19Component } from './file-upload-vgg19/file-upload-vgg19.component';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    FileUploadVGG19Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
    
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
