export class CommentData {
    commentId: number | null;
    userId: number | null;
    username: string;
    mediaUuid: string | null;
    galleryId: number | null;
    text: string;
    dateCreated: Date;

    constructor(
        commentId?: number,
        userId?: number,
        username?: string,
        mediaUuid?: string | null,
        galleryId?: number | null,
        text?: string,
        dateCreated?: Date
    ) {
        this.commentId = commentId ?? null;
        this.userId = userId ?? null;
        this.username = username ?? '';
        this.mediaUuid = mediaUuid ?? null;
        this.galleryId = galleryId ?? null;
        this.text = text ?? '';
        this.dateCreated = dateCreated ?? new Date();
    }
}