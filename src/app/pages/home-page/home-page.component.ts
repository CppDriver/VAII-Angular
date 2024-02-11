import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private dataService: DataService) {}
  
  ngOnInit() {
    this.fetchImages();
  }

  fetchImages() {
    this.dataService.requestMedia();
  }
}
