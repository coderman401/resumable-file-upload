import { Component, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';

// services
import { FileService } from '../services/file.service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

    @ViewChild('fileInputRead', { static: true }) fileInputRead: { nativeElement: { [x: string]: File; click?: any; }; };

    file: File | null = null;

    progress = 0;

    state = false;

    isResume = false;
    isPaused = false;

    name = '';
    fileId = '';

    subscribe$: Subscription;
    destroy$ = new Subject();


    constructor(private fileService: FileService, private snackBar: MatSnackBar) { }

    onClickFileInputButton(): void {
        this.fileInputRead.nativeElement.click();
    }

    // select file to upload
    onChangeFileInput(): void {
        const files: { [key: string]: File } = this.fileInputRead.nativeElement;
        this.file = files.files[0];
        if (this.file) {
            this.name = this.file.name;
            this.checkUploadStatus();
        }
    }

    // check upload status that file is preset in server
    checkUploadStatus() {
        this.fileId = `${this.name}-${this.file.lastModified}`;
        let headerData: any;
        headerData = {
            size: this.file.size.toString(),
            'x-file-id': this.fileId,
            name: this.name.toString()
        };

        // get file status
        this.fileService.getStatus(headerData).pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
            if (response.status === 'file is present') {
                alert(response.status);
                this.resetFileProgress();
                return;
            }
            const uploadedBytes = response.uploaded;

            if (uploadedBytes > 0) {
                this.isResume = true;
                const percent = Math.round((uploadedBytes / this.file.size) * 100);
                this.showSnakbar(`Upload resumed from ${percent}%`);
            }
            this.processUploading(uploadedBytes);
        });
    }

    // start uploading progress
    processUploading(startByte: number) {
        const headersData = {
            size: this.file.size.toString(),
            'x-file-id': this.fileId,
            'x-start-byte': startByte.toString(),
            name: this.name
        };
        const postData = this.file.slice(startByte, this.file.size + 1);
        this.subscribe$ = this.fileService.uploadFile(postData, headersData).subscribe((event: HttpEvent<any>) => {

            switch (event.type) {
                case HttpEventType.Sent:
                    this.state = true;
                    break;
                case HttpEventType.UploadProgress:
                    let total: number;
                    let loaded: number;
                    if (this.isResume) {
                        total = this.file.size;
                        loaded = event.loaded + startByte;
                    } else {
                        total = event.total;
                        loaded = event.loaded;
                    }

                    console.log(`${this.progress}%`, `Total = ${total}`, `loaded = ${loaded}`);
                    this.progress = Math.round(loaded / total * 100);
                    if (this.progress === 100) {
                        this.showSnakbar('File uploaded successfully!');
                    }
                    break;
                case HttpEventType.Response:
                    setTimeout(() => {
                        this.resetFileProgress();
                    }, 1500);
            }
        });
    }

    pausePlayUpload() {
        if (!this.isPaused) {
            this.subscribe$.unsubscribe();
        } else {
            this.checkUploadStatus();
        }
        this.isPaused = !this.isPaused;
    }

    cancelFile() {
        this.subscribe$.unsubscribe();
        this.resetFileProgress();
    }

    resetFileProgress() {
        this.progress = 0;
        this.state = false;
        this.file = null;
        this.isResume = false;
        this.isPaused = false;
    }
    showSnakbar(message: string) {
        this.snackBar.open(message, 'OK', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
    }

}
