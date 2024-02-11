import { Component, Renderer2 } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MediaDataShort } from 'src/app/models/transfer-models/MediaDataShort';

@Component({
  selector: 'app-photo-grid',
  templateUrl: './photo-grid.component.html',
  styleUrl: './photo-grid.component.css'
})
export class PhotoGridComponent {

  get images(): MediaDataShort[] {
    return this.dataService.viewedMedia;
  }
  get imageUrls(): { [key: string]: string } {
    return this.dataService.imageUrls;
  }
  imageRowViewData: {imgCount: number, imgIndex: number}[] = [];
  imageViewData: {width: number, height: number}[][] = [];
  imageLoadedFlag: boolean[] = [];
  resizeSubject = new Subject();
  private unlistenWindowResize!: () => void;

  constructor(private dataService: DataService, private renderer: Renderer2) {}
  
  ngOnInit() {
    this.imageLoadedFlag = new Array(this.images.length).fill(false);
    console.log('images fetched, initialized');
    this.resizeSubject.pipe(debounceTime(500)).subscribe(() => {
      this.setImagesContainer();
    });
    this.dataService.viewedMediaSubject.subscribe(() => {
      this.imageLoadedFlag = new Array(this.images.length).fill(false);
      this.setImagesContainer();
    });
  }

  ngAfterViewInit() {
    console.log('view initialized, trying to generate image elements');
    this.unlistenWindowResize = this.renderer.listen(window, 'resize', () => {
      this.resizeSubject.next(null);
    });
  }

  ngOnDestroy() {
    this.unlistenWindowResize();
    this.resizeSubject.unsubscribe();
  }

  setImagesContainer(minHeight: number = 200, gap: number = 5) {
    let settingTime = Date.now();
    console.log('Generating image elements');
    if (this.images.length == 0) {
      return;
    }
    let tempImgViewData: {width: number, height: number}[][] = [];
    let currentRowImageIndex = 0;
    let imagesContainer = document.getElementById('images-container');
    if (!imagesContainer) {
      return;
    }
    let rowNo = 0;
    while (currentRowImageIndex < this.images.length) {
      let result = this.getRowImageCount(currentRowImageIndex, imagesContainer.clientWidth, minHeight, gap);
      let rowImageCount = result.imageCount;
      let rowLast = result.last; 
      let cumulativeAspR = 0;
      for (let i = 0; i < rowImageCount; i++) {
        cumulativeAspR += this.images[currentRowImageIndex + i].width / this.images[currentRowImageIndex + i].height;
      }
      for (let i = 0; i < rowImageCount; i++) {
        let currentImageIndex = currentRowImageIndex + i;
        let currentImageWidth = this.images[currentImageIndex].width;
        let currentImageHeight = this.images[currentImageIndex].height;
        let currentImageAspR = currentImageWidth / currentImageHeight;
        let currentImageDisplayWidth = 0;
        let currentImageDisplayHeight = 0;
          currentImageDisplayWidth = currentImageAspR / cumulativeAspR * (imagesContainer.clientWidth - gap * (rowImageCount - 1));
          currentImageDisplayHeight = currentImageDisplayWidth / currentImageAspR;
        if (rowLast) {
          if (currentImageDisplayHeight > minHeight * 1.5) {
            currentImageDisplayHeight = minHeight * 1.4;
            currentImageDisplayWidth = currentImageDisplayHeight * currentImageAspR;
          }
        }
        if (currentImageDisplayWidth > 800 || true)
        {
          console.log('image - ', {ciw: currentImageWidth, cih: currentImageHeight, ciAspR: currentImageAspR, cumAspR: cumulativeAspR, width: currentImageDisplayWidth, height: currentImageDisplayHeight, clientW: imagesContainer.clientWidth, rowImgCount: rowImageCount, rowNo: rowNo, imgIndex: i, imgStartIndex: currentRowImageIndex, imgCount: this.images.length});
        }
        if (i == 0) {
          tempImgViewData.push([]);
        }
        tempImgViewData[rowNo].push({width: currentImageDisplayWidth, height: currentImageDisplayHeight});
      }
      this.imageRowViewData[rowNo] = {imgCount: rowImageCount, imgIndex: currentRowImageIndex};
      currentRowImageIndex += rowImageCount;
      rowNo++;
    }
    console.log('Image row view data:', this.imageRowViewData);
    console.log('Image view data:', tempImgViewData);
    console.log('setting time: ', Date.now() - settingTime);
    this.imageViewData = tempImgViewData;
  }

  getRowImageCount(imageStartIndex: number, containerWidth: number, targetHeight: number, gap: number): { imageCount: number, last: boolean } {
    let imageCount = 1;
    let resultFound = false;
    let last = false;
    end: while (!resultFound) {
      let cumulativeAspR = 0;
      let imgAspR = 0;
      for (let i = 0; i <= imageCount; i++) {
        if (imageStartIndex + i >= this.images.length) {
          resultFound = true;
          last = true;
          break end;
        }
        imgAspR = this.images[imageStartIndex + i].width / this.images[imageStartIndex + i].height;
        cumulativeAspR += imgAspR;
      }
      if (imgAspR / cumulativeAspR * (containerWidth - gap * (imageCount - 1)) / imgAspR < targetHeight) {
        resultFound = true;
      }
      else {
        imageCount++;
      }
    }
    console.log('image count: ', imageCount);
    return { imageCount: imageCount, last: last };
  }
  
  getImageIndex(rowIndex: number, imgIndex: number): number {
    let count = 0;
    for (let i = 0; i < rowIndex; i++) {
      count += this.imageViewData[i].length;
    }
    return count + imgIndex;
  }
}
