import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { CommentData } from 'src/app/models/transfer-models/CommentData';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})

export class CommentsComponent {
  @Input() mediaUuid!: string | null;
  @Input() galleryId!: number | null;

  comments: CommentData[] = [];
  newComment: string = '';

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mediaUuid'] || changes['galleryId']) {
      this.httpClient.get<{ result: CommentData[]}>('http://localhost:5080/comment/getComments?mediaUuid=' + this.mediaUuid).subscribe(
      (data: {result: CommentData[]}) => {
        console.log('Received comments:', data.result);
        this.comments = data.result;
      },
      error => {
        console.error('Error fetching comments:', error);
      });
    }
  }

  addComment() {
    if (this.newComment === '') {
      return;
    }

    let comment = new CommentData(undefined, undefined, this.authService.getUserName(), this.mediaUuid, this.galleryId, this.newComment, new Date());
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.httpClient.post<CommentData>('http://localhost:5080/comment/postComment', {
        UserId: comment.userId,
        Username: comment.username,
        MediaUuid: comment.mediaUuid,
        GalleryId: comment.galleryId,
        Text: comment.text,
        DateCreated: comment.dateCreated
    },{ headers: headers }).subscribe(
      (data: CommentData) => {
        console.log('Added comment:', data);
        this.comments.push(data);
        this.newComment = '';
      },
      error => {
        console.error('Error adding comment:', error);
      }
    );
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
