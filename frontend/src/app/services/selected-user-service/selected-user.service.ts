import { Injectable } from '@angular/core';
import { IUser } from '../../interfaces/user';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../../interfaces/httpResponse';
import { environment } from '../../../environments/environments';
import { IComment, ITopic } from '../../interfaces/topic.interface';
import { TopicService } from '../topics-service/topic.service';


export enum Permissions {
  ReadComments = 1 << 0, //1
  WriteComments = 1 << 1, //2
  DeleteAndAddTopics = 1 << 2, //4
  DeleteOthersStuff = 1 << 3, //8
}
export enum Role {
  Guest = 1,
  Silver = 2,
  Gold = 3,
  Admin = 0
}

export const rolePermissions = {
  [Role.Guest]: Permissions.ReadComments,
  [Role.Silver]: Permissions.ReadComments | Permissions.WriteComments,
  [Role.Gold]: Permissions.ReadComments | Permissions.WriteComments | Permissions.DeleteAndAddTopics,
  [Role.Admin]: Permissions.ReadComments | Permissions.WriteComments | Permissions.DeleteAndAddTopics | Permissions.DeleteOthersStuff
}

@Injectable({
  providedIn: 'root'
})
export class SelectedUserService {

  // { Variables }

  private _selectedUser = new BehaviorSubject<IUser | undefined>(undefined);
  selectedUser$ = this._selectedUser.asObservable();
  usersList: IUser[] = [];

  // { Constructor }
  constructor(private http: HttpClient, private topicService: TopicService) { }

  // { Methods }
  setSelectedUser(user: IUser) {
    this._selectedUser.next(user);
  }

  getUsers(): void {
    this.http.get<IApiResponse>(`${environment.API_URL}/users`).subscribe(users => {
      this.usersList = users.data;
    });
  }

  getSelectedUser(): IUser {
    return this._selectedUser.value as IUser;
  }

  getSelectedUsersCommentsAndTopics(): Observable<{ topicsCount: number, commentsCount: number }> {
    return this.selectedUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.topicService.getTopicsList().pipe(
            map(topics => {
              let userTopics = topics.filter((topic: ITopic) => topic.author.id === user.id);
              let userComments = 0;
              topics.forEach((topic: ITopic) => {
                userComments += this.countUserComments(topic.comments, user.id);
              });
              return { topicsCount: userTopics.length, commentsCount: userComments };
            })
          );
        } else {
          return of({ topicsCount: 0, commentsCount: 0 });
        }
      })
    );
  }

  countUserComments(comments: IComment[], userId: number): number {
    let count = 0;
    for (let comment of comments) {
      if (comment.author.id === userId) {
        count++;
      }
      count += this.countUserComments(comment.comments, userId);
    }
    return count;
  }
}
