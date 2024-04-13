import { Component } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TopicService } from '../../../../services/topics-service/topic.service';
import { CommonModule } from '@angular/common';
import { TreeNode } from 'primeng/api';
import { IComment, ITopic } from '../../../../interfaces/topic.interface';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { IUser } from '../../../../interfaces/user';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectedUserService } from '../../../../services/selected-user-service/selected-user.service';

interface CommentNode extends TreeNode {
  id?: number;
  chatOpen?: boolean;
  author?: IUser;
  rootTopicId?: number;
}

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [TreeModule, CommonModule, ButtonModule, InputTextareaModule, FormsModule, ReactiveFormsModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.scss'
})
export class TopicListComponent {
  openedNode: CommentNode | null = null;
  nodes!: TreeNode[];
  activeUser: IUser | undefined;
  commentControl: FormControl = new FormControl('', Validators.required);

  constructor(private topicService: TopicService, private userSerivce: SelectedUserService) {
    this.topicService.topicList$.subscribe(topics => {
      this.nodes = this.transformTopicsToTreeNodes(topics);
    });

    this.userSerivce.selectedUser$.subscribe(user => {
      this.activeUser = user;
    });
  }

  transformTopicsToTreeNodes(topics: ITopic[]): TreeNode[] {
    return topics.map(topic => ({
      id: topic.id,
      label: topic.title,
      data: topic.body,
      author: topic.author,
      chatOpen: false,
      children: this.transformCommentsToTreeNodes(topic.comments, topic.id)
    }));
  }

  transformCommentsToTreeNodes(comments: IComment[], topicId: number): TreeNode[] {
    return comments.map(comment => ({
      rootTopicId: topicId,
      id: comment.id,
      label: '',
      data: comment.body,
      author: comment.author,
      chatOpen: false,
      children: this.transformCommentsToTreeNodes(comment.comments, topicId)
    }));
  }

  addComment(node: CommentNode) {
    console.log(node);
    const commentText = this.commentControl.value;
    const author = this.activeUser;

    if (author) {
      if (node.rootTopicId !== undefined) {
        // Adding a comment to another comment
        this.topicService.addComment(node.rootTopicId, commentText, author, node.id).subscribe(() => {
          this.topicService.getInitialTopics();
          this.commentControl.reset();
        });
      } else {
        // Adding a comment to a root topic
        this.topicService.addComment(node.id!, commentText, author).subscribe(() => {
          this.topicService.getInitialTopics();
          this.commentControl.reset();
        });
      }
    }
  }

  // I guess this is unsued, I really don't understand the endpoint I'm supposed to use. I'm just going to leave it here, just so you see I tried to do some shenanigans with this.
  getCommentPath(node: CommentNode): string {
    if (node.parent) {
      return this.getCommentPath(node.parent) + `/${node.id}`;
    } else {
      return `/topic/${node.id}/comment`;
    }
  }

  toggleChat(node: CommentNode): void {
    if (this.openedNode) {
      this.openedNode.chatOpen = false;
    }
    node.chatOpen = true;
    this.openedNode = node;
  }
}
