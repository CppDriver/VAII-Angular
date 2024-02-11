import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { MediaDataFull } from 'src/app/models/transfer-models/MediaDataFull';
import { MediaDataShort } from 'src/app/models/transfer-models/MediaDataShort';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, max } from 'rxjs';
import * as lodash from 'lodash';
import { GalleryDataShort } from 'src/app/models/transfer-models/GalleryDataShort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-media-page',
  templateUrl: './media-page.component.html',
  styleUrls: ['./media-page.component.css']
})
export class MediaPageComponent {
  private paramSubscription!: Subscription;
  imageUrl: string = '';
  currentImageIndex: number = 0;
  currentImageData: MediaDataFull = new MediaDataFull();
  editImageData: MediaDataFull = new MediaDataFull();
  uploaderImgUrl: string = '';
  editing: boolean = false;
  newTag: string = '';
  newGalleries: GalleryDataShort[] = [];
  selectedGallery: GalleryDataShort | undefined;
  get imagesContext(): MediaDataShort[] {
    return this.dataService.viewedMedia;
  }

  
  constructor(private route: ActivatedRoute, private dataService: DataService, private httpClient: HttpClient, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    
  }
  
  ngOnInit() {
    const apiUrl = 'http://localhost:5080/media/GetImage/';
    this.paramSubscription = this.route.params.subscribe(params => {
      const uuid = decodeURIComponent(this.route.snapshot.paramMap.get('url')!);
      this.currentImageIndex = this.imagesContext.findIndex((image) => image.uuid === uuid);
      this.imageUrl = apiUrl + uuid + '/' + this.getSize();
        this.dataService.getMediaInfo(uuid).subscribe(
          (data: MediaDataFull)  => {
            this.currentImageData = data;
            this.uploaderImgUrl = 'http://localhost:5080/user/getUserProfileImg/' + this.currentImageData.userId + '?' + new Date().getTime();
            this.newGalleries = lodash.cloneDeep(this.dataService.userGalleries) ?? [];
            this.newGalleries = this.newGalleries.filter(gallery => !this.currentImageData.galleries.includes(gallery));
          },
          error => {
            this.snackBar.open('Error fetching media info', 'Close', {duration: 3000});
          });
      
    });
    // }
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  getSize() : string {
    if(window.innerWidth < 480) {
      return 'sd';
    }
    if(window.innerWidth < 768) {
      return 'hd';
    }
    if (window.innerWidth < 1024) {
      return 'fhd';
    }
      return 'uhd';
  }

  isOwner() : boolean {
    return this.currentImageData.username === this.authService.getUserName();
  }

  enableEdit() {
    this.editImageData = lodash.cloneDeep(this.currentImageData);
    this.newGalleries = this.dataService.userGalleries ?? [];
    this.editing = true;
  }

  deleteMedia() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.httpClient.delete('http://localhost:5080/media/deleteMedia?uuid=' + this.currentImageData.uuid, { headers: headers }).subscribe(
      (data: any) => {
        this.snackBar.open('Media deleted', 'Close', {duration: 3000});
        this.dataService.viewedMedia.splice(this.currentImageIndex, 1);
        this.currentImageIndex = Math.min(this.currentImageIndex, this.dataService.viewedMedia.length - 1);
        if (this.currentImageIndex >= 0) {
          this.router.navigate(['/media/' + this.dataService.viewedMedia[this.currentImageIndex].uuid]);
        }
        this.router.navigate(['/']);
      },
      error => {
        this.snackBar.open('Error deleting media', 'Close', {duration: 3000})
      });
  }
  
  saveEdit() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.httpClient.put('http://localhost:5080/media/updateMedia', {
        Uuid: this.editImageData.uuid,
        Title: this.editImageData.title,
        Description: this.editImageData.description,
        Access: this.editImageData.access,
        Tags: this.editImageData.tags,
        Galleries: this.editImageData.galleries
    },{ headers: headers }).subscribe(
      (data: any) => {
        this.snackBar.open('Media updated', 'Close', {duration: 3000});
        this.currentImageData = this.editImageData;
        this.editing = false;
      },
      error => {
        this.snackBar.open('Error updating media', 'Close', {duration: 3000});
      });
  }

  cancelEdit() {
    this.editing = false;
  }

  addTag() {
    if (this.newTag === '') {
      return;
    }
    if (!this.editImageData.tags.includes(this.newTag)) {
      this.editImageData.tags.push(this.newTag.trim());
    }
    this.newTag = '';
  }

  removeTag(tag: string) {
    this.editImageData.tags.splice(this.editImageData.tags.indexOf(tag), 1);
  }

  addGallery(gallery: GalleryDataShort | undefined) {
    if (gallery == undefined) {
      return;
    }
    if (!this.currentImageData.galleries.includes(gallery)) {
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
      this.httpClient.put("http://localhost:5080/media/addToGallery?galleryId="+gallery.galleryId.toString()+"&mediaUuid="+this.currentImageData.uuid,{}, { headers: headers})
        .subscribe(
          (data: any) => {
            this.currentImageData.galleries.push(gallery);
            this.newGalleries.splice(this.newGalleries.indexOf(gallery), 1);
            this.snackBar.open('Added to gallery '+gallery.title, 'Close', {duration: 3000});
            this.selectedGallery = undefined;
          },
          error => {
            console.log(error);
            this.snackBar.open('Failed adding to gallery', 'Close', {duration: 3000});
          }
        );
    }
  }

  removeGallery(gallery: GalleryDataShort) {
    this.editImageData.galleries.splice(this.editImageData.galleries.indexOf(gallery), 1);
    this.newGalleries.push(gallery);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.editing || this.currentImageIndex < 0) {
      return;
    }
    if (event.key === 'ArrowRight' && this.currentImageIndex < this.imagesContext.length - 1) {
      this.currentImageIndex++;
      this.router.navigate(['/media/' + this.imagesContext[this.currentImageIndex].uuid]);
    }
    if (event.key === 'ArrowLeft' && this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.router.navigate(['/media/' + this.imagesContext[this.currentImageIndex].uuid]);
    }
  }
}
