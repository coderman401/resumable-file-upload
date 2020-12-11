import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class FileService {

    url = 'http://localhost:1224/';
    headers: any;

    constructor(private httpClient: HttpClient) { }

    // handle response error
    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        window.alert(errorMessage);
        return throwError(errorMessage);
    }

    // upload file
    uploadFile(file: any, headersData: any): Observable<any> {
        const headers = new HttpHeaders(headersData);

        return this.httpClient.post<any>(`${this.url}upload` , file, {
            headers,
            reportProgress: true,
            observe: 'events'
        }).pipe(catchError(this.handleError));
    }

    // get file status
    getStatus(data: any): Observable<any> {
        const headers = new HttpHeaders(data);

        return this.httpClient.get<any>(`${this.url}status`, {headers});
    }

}
