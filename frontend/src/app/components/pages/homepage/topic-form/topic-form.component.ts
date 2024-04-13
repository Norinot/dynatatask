import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TopicService } from '../../../../services/topics-service/topic.service';
import { SelectedUserService } from '../../../../services/selected-user-service/selected-user.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IUser } from '../../../../interfaces/user';

@Component({
  selector: 'app-topic-form',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule, InputTextModule, InputTextareaModule],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.scss'
})
export class TopicFormComponent {
  topicForm: FormGroup;
  selectedUser: IUser | undefined;

  constructor(fb: FormBuilder, private topicService: TopicService, private userSerivce: SelectedUserService) {
    this.topicForm = fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });

    this.userSerivce.selectedUser$.subscribe(user => {
      this.selectedUser = user;
    });
  }

  submitTopic(): void {
    if (!this.selectedUser) {
      return;
    }
    const topic = {
      title: this.topicForm.value.title,
      body: this.topicForm.value.body,
      author: this.selectedUser,
    }

    this.topicService.createNewtopic(topic).subscribe(() => {
      this.topicForm.reset();
      this.topicService.getInitialTopics();
    }, error => {
      console.error(error);
    });
  }
}
