// modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadRoutingModule } from './file-upload-routing.module';
import { MaterialModule } from '../shared/material.module';

// component
import { FileUploadComponent } from './file-upload.component';

@NgModule({
    declarations: [FileUploadComponent],
    imports: [
        CommonModule,
        FileUploadRoutingModule,
        MaterialModule
    ],
})
export class FileUploadModule { }
