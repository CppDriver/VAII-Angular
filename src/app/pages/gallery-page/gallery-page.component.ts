import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.css'
})
export class GalleryPageComponent {
  private paramSubscription!: Subscription;
  profileImgUrl: string = '';
  editing: boolean = false;
  editGalleryTitle: string = '';
  editGalleryDescription: string = '';
  get gallery() {
    return this.dataService.viewedGallery;
  }

  constructor(private route: ActivatedRoute, private dataService: DataService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(params => {
      const galleryId = decodeURIComponent(params['url']);
        this.dataService.updateViewedGallery(Number(galleryId));
        this.dataService.requestGalleryMedia(galleryId);
        this.profileImgUrl = 'http://localhost:5080/user/getUserProfileImg/' + this.gallery.userId + '?' + new Date().getTime();
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  isOwner() {
    return this.dataService.viewedGallery.username === this.authService.getUserName();
  }

  redirectToUser() {
    this.router.navigate(['/user', this.dataService.viewedGallery.username]);
  }

  enableEdit() {
    this.editing = true;
    this.editGalleryTitle = this.gallery.title;
    this.editGalleryDescription = this.gallery.description;
  }

  cancelEdit() {
    this.editing = false;
  }

  saveEdit() {
    this.dataService.editGallery(this.gallery.galleryId, this.editGalleryTitle, this.editGalleryDescription);
    this.editing = false;
  }

  deleteGallery() {
    this.dataService.deleteGallery(this.gallery.galleryId);
  }
}
