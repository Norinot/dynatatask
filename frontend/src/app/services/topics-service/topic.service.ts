import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INewTopic, ITopic } from '../../interfaces/topic.interface';
import { IApiResponse } from '../../interfaces/httpResponse';
import { environment } from '../../../environments/environments';
import { IUser } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private _topicList = new BehaviorSubject<ITopic[]>([]);
  topicList$ = this._topicList.asObservable();



  constructor(private http: HttpClient) { }

  getTopicsList(): Observable<ITopic[]> {
    return this.topicList$;
  }

  getInitialTopics(): void {
    this.http.get<IApiResponse>(`${environment.API_URL}/topics`).subscribe(topics => {
      this._topicList.next(topics.data);
    });
  }

  createNewtopic(topic: INewTopic) {
    return this.http.post<IApiResponse>(`${environment.API_URL}/topic/add`, topic);
  }

  /* This just doesn't work, I was able to make it work where we add a comment just to a topic and thats it, but for the comments it just doesn't work, I've tried it in the following ways:
  The way it is written down exactly:
  /topic/:topicId/comment/:commentId/add - /topic/1/comment/5/add

  I tried looking at nested comments and then move in like that:

  /topic/:topicId/comment/:commentId/comment/:commentId/add - /topic/2/comment/2/comment/3/add

  And I've also tried simply leaving behind the "comment" keyword after the first commentId - /topic/1/comment/5/3/add and that didn't work also.
  I'm probably just very tired and missing something, but I've been at this for a while now and I just can't seem to make it work, server respons with 404 not found, yet I can find it in the 'jashon file. I'm gonna be leaving this here. I'm sorry.
  */
  addComment(id: number, comment: string, author: IUser, commentId?: number) {
    let url = `${environment.API_URL}/topic/${id}/comment`;
    if (commentId !== undefined) {
      url += `/${commentId}`;
    }
    url += '/add';
    return this.http.post<IApiResponse>(url, { body: comment, author: author });
  }
}
