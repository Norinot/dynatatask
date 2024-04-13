import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IUser } from './interfaces/user';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SelectedUserService } from './services/selected-user-service/selected-user.service';
import { TopicService } from './services/topics-service/topic.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ButtonModule, DropdownModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  activeUser: IUser | undefined;

  constructor(public selectedUserService: SelectedUserService, private topicService: TopicService) {
    this.selectedUserService.getUsers();
    this.topicService.getInitialTopics();
  }

  onUserChange(user: IUser) {
    this.selectedUserService.setSelectedUser(user);
  }
}
