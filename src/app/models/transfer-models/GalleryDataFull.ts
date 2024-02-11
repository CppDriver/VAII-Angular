export class GalleryDataFull {
    galleryId: number;
    title: string;
    description: string;
    userId: number;
    username: string;
    mediaCount: number;

    constructor(
        galleryId?: number,
        title?: string,
        description?: string,
        userId?: number,
        username?: string,
        items?: number
    ) {
        this.galleryId = galleryId ?? 0;
        this.title = title ?? '';
        this.description = description ?? '';
        this.userId = userId ?? 0;
        this.username = username ?? '';
        this.mediaCount = items ?? 0;
    }
}