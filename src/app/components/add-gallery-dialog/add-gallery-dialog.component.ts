import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-gallery-dialog',
  templateUrl: './add-gallery-dialog.component.html',
  styleUrl: './add-gallery-dialog.component.css',
})
export class AddGalleryDialogComponent {
  galleryName: string = '';
  galleryDescription: string = '';

  constructor(public dialogRef: MatDialogRef<AddGalleryDialogComponent>) {}


  createGallery() {
    this.dialogRef.close({name: this.galleryName, description: this.galleryDescription});
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
