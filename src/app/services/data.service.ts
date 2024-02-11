import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, Subscription, distinctUntilChanged, firstValueFrom, map } from "rxjs";
import { GalleryDataShort } from "../models/transfer-models/GalleryDataShort";
import { MediaDataFull } from "../models/transfer-models/MediaDataFull";
import { MediaDataShort } from "../models/transfer-models/MediaDataShort";
import { AuthService } from "./auth.service";
import { UserDataFull } from "../models/transfer-models/UserDataFull";
import { GalleryDataFull } from "../models/transfer-models/GalleryDataFull";


@Injectable({
    providedIn: 'root'
})
export class DataService {
    viewedMedia: MediaDataShort[] = [];
    public viewedMediaSubject: Subject<boolean> = new Subject<boolean>();
    tags: string[] = [];
    viewedUser: UserDataFull = new UserDataFull();
    viewedUserGalleries: GalleryDataShort[] = [];

    viewedGallery: GalleryDataFull = new GalleryDataFull();

    userGalleries: GalleryDataShort[] | null = null;

    imageUrls: { [key: string]: string } = {};
    worker: Worker;

    private authStatusSubscription: Subscription;
    
    constructor(private httpClient: HttpClient, private authService: AuthService) {
        this.worker = new Worker(new URL('../workers/blurhash-decode.worker', import.meta.url), { type: 'module' });
        this.worker.addEventListener('message', (event) => {
            console.log('Received message from worker:', event.data);
            var start = Date.now();
            const canvas = document.createElement('canvas');
            canvas.width = event.data.width;
            canvas.height = event.data.height;
            const ctx = canvas.getContext('2d')!;
            const imageData = ctx.createImageData(event.data.width, event.data.height);
            imageData.data.set(event.data.pixels);
            ctx.putImageData(imageData, 0, 0);
            this.imageUrls[event.data.uuid] = canvas.toDataURL();
            console.log('Canvas drawing took: ', Date.now() - start, 'ms');
            console.log('ImageUrl:', this.imageUrls[event.data.uuid]);
            // this.images[event.data.uuid] = event.data.decodedBlurhash;
          });
        this.authStatusSubscription = this.authService.authStatusChanged.pipe(distinctUntilChanged()).subscribe((status) => {
            if (status) {
                this.loadUserData();
            } else {
                this.deleteUserData();
            }
        });
    }

    ngOnDestroy() {
        this.authStatusSubscription.unsubscribe();
    }

    async loadUserData() {
        if (this.userGalleries == null)
            this.userGalleries = await this.requestGalleries(this.authService.getUserName());
    }

    deleteUserData() {
        this.userGalleries = null;
    }

    async requestGalleries(username: string) : Promise<GalleryDataShort[]> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        var result = await firstValueFrom(this.httpClient.request('GET', `http://localhost:5080/gallery/GetGalleries/${username}`, { headers: headers }));
        return result as GalleryDataShort[];
    }

    requestMedia() : Promise<any> { 
        this.httpClient.request('GET', 'http://localhost:5080/media/GetImages').subscribe({
            next: (data) => {
                this.processRequestMediaResponse(data);
            },
            error: (error) => {
                console.error('Error fetching images:', error);
            },
        });
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    requestUserMedia(username: string) : Promise<any> {
        this.httpClient.request('GET', 'http://localhost:5080/media/GetUserImages/'+username).subscribe({
            next: (data) => {
                this.processRequestMediaResponse(data);
            },
            error: (error) => {
                console.error('Error fetching images:', error);
            },
        });
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    requestGalleryMedia(galleryId: string) : Promise<any> {
        this.httpClient.request('GET', 'http://localhost:5080/media/GetGalleryImages/'+galleryId).subscribe({
            next: (data) => {
                this.processRequestMediaResponse(data);
            },
            error: (error) => {
                console.error('Error fetching images:', error);
            },
        });
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    async processRequestMediaResponse(data: Object) {
        this.viewedMedia = data as MediaDataShort[];
        console.log('viewedMedia:', this.viewedMedia);
        for (let image of this.viewedMedia) {
            if (!this.imageUrls[image.uuid]) {
                var start = Date.now();
                this.imageUrls[image.uuid] = '';
                const width = 50;
                const height = Math.floor(width * (image.height / image.width));
                await this.worker.postMessage({ uuid: image.uuid, blurhash: image.blurhash, width: width, height: height });
                console.log('All together took: ', Date.now() - start, 'ms');
            }
        }
        this.viewedMediaSubject.next(true);
    }
    
    getMediaInfo(uuid: string) : Observable<MediaDataFull> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.httpClient.request('GET', `http://localhost:5080/media/GetMediaInfo/${uuid}`, { headers: headers }).pipe(
            map(data => {
                console.log('Received data:', data);
                return data as MediaDataFull;
            }),
        );
    }

    async updateViewedUser(username: string) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        let response = await firstValueFrom(this.httpClient.get('http://localhost:5080/user/getUserDataFull?username='+username, { headers: headers }));
        this.viewedUser = response as UserDataFull;

        let response2 = await firstValueFrom(this.httpClient.get('http://localhost:5080/gallery/GetGalleries/'+username, { headers: headers }));
        this.viewedUserGalleries = response2 as GalleryDataShort[];
    }

    async updateViewedGallery(galleryId: number) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        let response = await firstValueFrom(this.httpClient.get('http://localhost:5080/gallery/getGalleryDataFull/'+galleryId, { headers: headers }));
        this.viewedGallery = response as GalleryDataFull;
    }

    async createGallery(name: string, description: string) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        let response = await firstValueFrom(this.httpClient.post('http://localhost:5080/gallery/createGallery', { Title: name, Description: description }, { headers: headers }));
        console.log('Created gallery:', response);
        this.userGalleries = await this.requestGalleries(this.authService.getUserName());
    }

    async editGallery(galleryId: number, name: string, description: string) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        let result = await firstValueFrom(this.httpClient.put('http://localhost:5080/gallery/updateGallery', { Id: galleryId, Title: name, Description: description }, { headers: headers }));
        if (result) {
            this.userGalleries = await this.requestGalleries(this.authService.getUserName());
            this.viewedGallery.title = name;
            this.viewedGallery.description = description;
        }
    }

    async deleteGallery(galleryId: number) {
        let headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        let result = await firstValueFrom(this.httpClient.delete('http://localhost:5080/gallery/deleteGallery/'+galleryId, { headers: headers }));
        if (result) {
            this.userGalleries = await this.requestGalleries(this.authService.getUserName());
        }
    }
}