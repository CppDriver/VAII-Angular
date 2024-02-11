export class UserData {
  id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  location: string;
  bio: string;

  constructor(
    id?: string,
    username? : string,
    name? : string,
    surname? : string,
    email? : string,
    location? : string,
    bio? : string
  )
  {
    this.id = id ?? '';
    this.username = username ?? '';
    this.name = name ?? '';
    this.surname = surname ?? '';
    this.email = email ?? '';
    this.location = location ?? '';
    this.bio = bio ?? '';
  }
}
