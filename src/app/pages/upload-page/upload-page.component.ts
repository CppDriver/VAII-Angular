import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadService } from 'src/app/services/upload.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css'],
})
export class UploadPageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  private subscriptions: Subscription = new Subscription();
  public selectedFiles: string[] = [];
  constructor(private http: HttpClient, private uploadService: UploadService) { }
  get files(): [File, string][] {
    return this.uploadService.files;
  }
  get fileUrls(): { [key: string]: string } {
    return this.uploadService.fileUrls;
  }
  get fileData(): { [key: string]: any } {
    return this.uploadService.fileData;
  }
  get fileUploadStates(): { [key: string]: Observable<[string, number, number]> } {
    return this.uploadService.fileUploadStates;
  }

  ngOnInit() {
    window.addEventListener('drop', this.onFileDrop);
    window.addEventListener('dragover', this.onFileDragOver);
  }
  
  ngAfterViewInit() {
    this.subscribeToUploadStates(this.files);
  }

  ngOnDestroy() {
    window.removeEventListener('drop', this.onFileDrop);
    window.removeEventListener('dragover', this.onFileDragOver);
    this.subscriptions.unsubscribe();
  }


  onFileSelected(event: Event) {
    const selectedFiles = (event.target as HTMLInputElement).files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].type !== 'image/jpeg') {
          this.fileInput.nativeElement.value = '';
        }
      }
      this.subscribeToUploadStates(this.uploadService.uploadFiles(selectedFiles));
    }
  }

  onFileDrop = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles) {
        for (let i = 0; i < droppedFiles.length; i++) {
          if (droppedFiles[i].type !== 'image/jpeg') {
            this.fileInput.nativeElement.value = '';
          }
        }
        this.subscribeToUploadStates(this.uploadService.uploadFiles(droppedFiles));
      }
      this.fileInput.nativeElement.value = '';
    }
  }

  onFileDragOver = (event: DragEvent) => {
    event.preventDefault();
  }

  subscribeToUploadStates(files: [File, string][]) {
    if (!files) {
      return;
    }
    files.forEach(([file, uuid]: [File, string]) => {
      const subscription = this.fileUploadStates[uuid].subscribe((loadedState: [string, number, number]) => {
        console.log('fileUploadStates[file.name] emitted a value:', loadedState);
        this.refreshLoading(uuid, loadedState);
      });
      this.subscriptions.add(subscription);
    });
  }

  refreshLoading(uuid: string, loadedState: [string, number, number]) {
    const image = document.querySelector(`[id="${uuid}"]`) as HTMLImageElement;
    if (!image) {
      console.log('refreshLoading was called with:', uuid, loadedState, 'but no image was found');
      return;
    }
    const width = this.getActualWidth(image);
    const offsetLeft = (image.width - width) / 2 / image.width * 100;
    image.style.clipPath = `polygon(0 0, ${loadedState[1]/100 * (100 - offsetLeft * 2) + offsetLeft}% 0, ${loadedState[1]/100 * (100 - offsetLeft * 2) + offsetLeft}% 100%, 0 100%)`;
  };
  
  getActualWidth(image: HTMLImageElement): number {
    const imgAspRatio = image.naturalWidth / image.naturalHeight;
    const divAspRatio = image.width / image.height;
    let actualRenderedImageWidth = image.width;
    if (imgAspRatio < divAspRatio) {
      actualRenderedImageWidth = imgAspRatio * image.height;
    }
    return actualRenderedImageWidth;
  }

  cancelUpload([file, uuid]: [File, string]) {
    this.uploadService.cancelUpload(file, uuid);
  }

  saveUpload([file, uuid]: [File, string]) {
    this.uploadService.saveUpload(file, uuid);
  }

  toggleSelected(uuid: string) {
    const index = this.selectedFiles.indexOf(uuid);
    if (index === -1) {
      this.selectedFiles.push(uuid);
    } else {
      this.selectedFiles.splice(index, 1);
    }
  }
}