import { Component, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GalleryDataShort } from 'src/app/models/transfer-models/GalleryDataShort';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.css']
})
export class GalleryListComponent {
  @Input() galleriesList!: GalleryDataShort[];
  noThumbnail: boolean[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['galleriesList']) {
      this.noThumbnail = new Array(this.galleriesList.length).fill(false);
      console.log('Galleries:', this.galleriesList);
    }
  }
}
