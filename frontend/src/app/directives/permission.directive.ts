import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from "@angular/core";
import { Role, rolePermissions, Permissions } from "../services/selected-user-service/selected-user.service";


//Time is short on my end, and my idea with this was that it will be neat to have a directive that can add a class to an element that would determine if a certain role has permissions to view it. Now that I look at it, its not that great. For example I would want to not render the 'add comment' section if a certain Role has no permission to use it. I mean, I can do that with this, given I actually get a class I can work with, so in CSS I can just display: none the element, but I'm pretty sure I can do this from inside the directive itself. So yeah would do it differently, but I'm not gonna bother with it given how much time I could spend on doing this task.

@Directive({
  standalone: true,
  selector: '[appPermission]'
})
export class PermissionDirective implements OnChanges {
  @Input() appPermission: Role = Role.Guest;
  @Input() permission: Permissions = Permissions.ReadComments;
  private currentClass: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appPermission'] || changes['permission']) {
      this.updatePermissionClass();
    }
  }

  private updatePermissionClass(): void {
    if (this.currentClass) {
      this.renderer.removeClass(this.el.nativeElement, this.currentClass);
    }

    const permissionsForRole = rolePermissions[this.appPermission];
    if ((permissionsForRole & this.permission) !== 0) {
      this.renderer.addClass(this.el.nativeElement, 'has-permission');
      this.currentClass = 'has-permission';
    }
  }
}

