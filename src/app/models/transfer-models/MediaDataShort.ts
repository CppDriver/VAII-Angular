export class MediaDataShort {
    uuid: string;
    title: string;
    author: string;
    width: number;
    height: number;
    blurhash: string;

    constructor(
        uuid?: string,
        title?: string,
        author?: string,
        width?: number,
        height?: number,
        blurhash?: string
    ) {
        this.uuid = uuid ?? '';
        this.title = title ?? '';
        this.author = author ?? '';
        this.width = width ?? 0;
        this.height = height ?? 0;
        this.blurhash = blurhash ?? '';
    }
}