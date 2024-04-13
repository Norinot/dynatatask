import { Component } from '@angular/core';
import { TopicListComponent } from './topic-list/topic-list.component';
import { TopicFormComponent } from './topic-form/topic-form.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TopicListComponent, TopicFormComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

}
