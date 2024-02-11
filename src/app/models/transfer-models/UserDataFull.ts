export class UserDataFull {
    id: string;
    username: string;
    name: string;
    surname: string;
    email: string;
    location: string;
    bio: string;
    MediaCount: number;
    GalleryCount: number;
    FollowersCount: number;
    FollowingCount: number;
  
    constructor(
        id?: string,
        username? : string,
        name? : string,
        surname? : string,
        email? : string,
        location? : string,
        bio? : string,
        mediaCount?: number,
        galleryCount?: number,
        followersCount?: number,
        followingCount?: number
    )
    {
        this.id = id ?? '';
        this.username = username ?? '';
        this.name = name ?? '';
        this.surname = surname ?? '';
        this.email = email ?? '';
        this.location = location ?? '';
        this.bio = bio ?? '';
        this.MediaCount = mediaCount ?? 0;
        this.GalleryCount = galleryCount ?? 0;
        this.FollowersCount = followersCount ?? 0;
        this.FollowingCount = followingCount ?? 0;
    }
  }
  