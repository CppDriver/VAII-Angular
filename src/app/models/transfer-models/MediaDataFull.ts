import { GalleryDataShort } from "./GalleryDataShort";

export class MediaDataFull {
    uuid: string;
    title: string;
    userId?: number;
    username?: string;
    description: string;
    dateCreated?: Date;
    width?: number;
    height?: number;
    size?: number;
    blurhash?: string;
    galleries: GalleryDataShort[];
    tags: string[];
    access: number;

    constructor(
        uuid?: string,
        title?: string,
        userId?: number,
        username?: string,
        description?: string,
        dateCreated?: Date,
        width?: number,
        height?: number,
        size?: number,
        blurhash?: string,
        galleries?: GalleryDataShort[],
        tags?: string[],
        access?: number
    ) {
        this.uuid = uuid ?? '';
        this.title = title ?? '';
        this.userId = userId ?? 0;
        this.username = username ?? '';
        this.description = description ?? '';
        this.dateCreated = dateCreated ?? new Date();
        this.width = width ?? 0;
        this.height = height ?? 0;
        this.size = size ?? 0;
        this.blurhash = blurhash ?? '';
        this.galleries = galleries ?? [];
        this.tags = tags ?? [];
        this.access = access ?? 0;
    }
}
