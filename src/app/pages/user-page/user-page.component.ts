import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GalleryDataShort } from 'src/app/models/transfer-models/GalleryDataShort';
import { UserDataFull } from 'src/app/models/transfer-models/UserDataFull';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AddGalleryDialogComponent } from 'src/app/components/add-gallery-dialog/add-gallery-dialog.component';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {
  private paramSubscription!: Subscription;
  get user(): UserDataFull {
    return this.dataService.viewedUser;
  }
  get galleries(): GalleryDataShort[] {
    return this.dataService.viewedUserGalleries;
  }
  profileImgUrl: string = '';
  

  constructor(private route: ActivatedRoute, private dataService: DataService, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.paramSubscription = this.route.params.subscribe(params => {
      const username = decodeURIComponent(params['url']);
        this.dataService.updateViewedUser(username);
        this.dataService.requestUserMedia(username);
        this.profileImgUrl = 'http://localhost:5080/user/getUserProfileImg/' + this.user.id + '?' + new Date().getTime();
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }

  isOwner() {
    return this.dataService.viewedUser.username === this.authService.getUserName();
  }

  openAddGalleryDialog() {
    const dialogRef = this.dialog.open(AddGalleryDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.createGallery(result.name, result.description);
        this.dataService.updateViewedUser(this.dataService.viewedUser.username);
      }
    });
  }
}