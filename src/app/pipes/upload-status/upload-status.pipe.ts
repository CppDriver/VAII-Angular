import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uploadStatus'
})
export class UploadStatusPipe implements PipeTransform {

  transform(value: number, size: number): string {
    if (size > 1048576)
      return `${value < 0 ? '???' :(value / 1048576).toFixed(1)} of ${(size / 1048576).toFixed(1)} MB`;
    return `${value < 0 ? '???' :(value / 1024).toFixed(0)} of ${(size / 1024).toFixed(0)} KB`;
  }

}
