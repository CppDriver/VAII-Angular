import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject, Subscription, catchError, map, of, shareReplay, takeUntil } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private endpoint = 'http://localhost:5080/upload';
    files: [File, string][] = [];
    fileUrls: { [key: string]: string } = {};
    fileData: { [key: string]: any } = {};
    fileUploadStates: { [key: string]: Observable<[string, number, number]> } = {};
    fileUploadSubscriptions: { [key: string]: Subscription } = {};
    fileUploadCancelSubjects: { [key: string]: Subject<void> } = {};
    fileSaveUploads: { [key: string]: boolean } = {};

    constructor(private httpClient: HttpClient) { }

    uploadFiles(files: FileList) : [File, string][] {
        const ret: [File, string][] = [];
        for (let i = 0; i < files.length; i++) {
            const uuid = uuidv4();
            this.files.push([files[i], uuid]);
            ret.push([files[i], uuid]);
            const url = URL.createObjectURL(files[i]);
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.fileData[uuid] = {title: `${files[i].name}`, description: '', width: img.width, height: img.height, size: files[i].size, access: 'Public'};
            };
            this.fileUrls[uuid] = url;
            const uploadObservable = this.uploadFile(files[i], uuid).pipe(
                map( (event: HttpEvent<any>): [string, number, number] => {
                    if (event.type === HttpEventType.UploadProgress && event.total) {
                    const percentDone = 100 * event.loaded / event.total;
                    return ['Uploading', percentDone, event.loaded];
                    } else if (event instanceof HttpResponse) {
                    return ['Uploaded', 100, files[i].size];
                    }
                    return ['Unknown', 0, 0];
                }),
                catchError(error => {
                    return of(['Upload failed', 0, 0] as [string, number, number]);
                }),
                shareReplay(1)
            );
            this.fileUploadStates[uuid] = uploadObservable;
            this.fileUploadSubscriptions[uuid] = uploadObservable.subscribe();
        }
        return ret;
    }

    uploadFile(file: File, uuid: string): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();
        formData.append('file', file, uuid);
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        const cancelSubject = new Subject<void>();
        this.fileUploadCancelSubjects[uuid] = cancelSubject;

        return this.httpClient.request('POST', `${this.endpoint}/uploadFile`, {
            body: formData,
            headers: headers,
            reportProgress: true,
            observe: 'events'
        }).pipe(takeUntil(cancelSubject));
    }

    cancelUpload(file: File, uuid: string) {
        if (this.fileUploadCancelSubjects[uuid]) {
            this.fileUploadCancelSubjects[uuid].next();
            this.fileUploadCancelSubjects[uuid].complete();
        }
        this.fileUploadStates[uuid].subscribe(([state, , ]) => {
            if (state === 'Uploaded') {
                const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
                this.httpClient.request('POST', `${this.endpoint}/cancelUpload`, {
                    body: {Uuid: uuid},
                    headers: headers
                }).subscribe(response => {
                    console.log(response);
                    console.log('Upload cancelled\nremoving file');
                });
            }
            this.removeFile(file, uuid);
          });
    }

    saveUpload(file: File, uuid: string) : number {
        console.log('I mean, at least it\'s getting called')
        if (this.fileSaveUploads[uuid]) {
            console.log('Already saving this file, cannot save again');
            return -1;
        }
        this.fileUploadStates[uuid].subscribe(([state, , ]) => {
            if (state === 'Uploading') {
                console.log('Upload in progress, cannot save yet');
                this.fileSaveUploads[uuid] = true;
                return -1;
            }
            if (state === 'Uploaded') {
                console.log('Trying to post')
                console.log(this.fileData[uuid]);
                const temp = this.fileData[uuid];
                const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
                this.httpClient.request('POST', `${this.endpoint}/saveUpload`, {
                    body: {Uuid: uuid, Title: temp.title, Description: temp.description, Width: temp.width, Height: temp.height, Size: temp.size, Access: temp.access},
                    observe: 'response',
                    headers: headers
                }).subscribe(response => {
                    if (response.status === 200) {
                    this.removeFile(file, uuid);
                    return 1;
                    }
                    else {
                        console.log('Returning bad news')
                        return 0;
                    }
                });
            }
            return 0;
          });
          return 0;
    }

    removeFile(file: File, uuid: string) {
        if (this.fileUploadCancelSubjects[uuid])
            delete this.fileUploadCancelSubjects[uuid];
        if (this.fileUploadSubscriptions[uuid]) {
            this.fileUploadSubscriptions[uuid].unsubscribe();
            delete this.fileUploadSubscriptions[uuid];
        }
        if (this.fileUploadStates[uuid])
            delete this.fileUploadStates[uuid];
        if (this.fileData[uuid]) 
            delete this.fileData[uuid];
        const index = this.files.findIndex(([f, u]) => f === file && u === uuid);
        if (index >= 0)
            this.files.splice(index, 1);
        if (this.fileUrls[uuid]) {
            URL.revokeObjectURL(this.fileUrls[uuid]);
            delete this.fileUrls[uuid];
        }
    }
}