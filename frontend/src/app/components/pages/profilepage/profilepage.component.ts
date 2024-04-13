import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectedUserService } from '../../../services/selected-user-service/selected-user.service';
import { IUser } from '../../../interfaces/user';
import { PermissionDirective } from '../../../directives/permission.directive';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

export function PasswordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (abstractControl: AbstractControl) => {
    const control = abstractControl.get(controlName);
    const matchingControl = abstractControl.get(matchingControlName);

    if (matchingControl!.errors && !matchingControl!.errors['passwordMismatch']) {

      return null;
    }

    if (control!.value !== matchingControl!.value) {
      const error = { passwordMismatch: 'Passwords do not match' };
      matchingControl!.setErrors(error);
      return error;
    } else {
      matchingControl!.setErrors(null);
      return null;
    }
  }
}

@Component({
  selector: 'app-profilepage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, InputTextModule, PermissionDirective],
  templateUrl: './profilepage.component.html',
  styleUrl: './profilepage.component.scss',
})
export class ProfilepageComponent {

  // { Variables }
  activeUser: IUser | undefined;
  userStats: { topicsCount: number, commentsCount: number } | undefined;
  profileForm: FormGroup;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;


  // { Constructor }
  constructor(private fb: FormBuilder, private selectedUserService: SelectedUserService, private http: HttpClient) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: '',
      password: ['', [Validators.minLength(8), Validators.pattern(this.passwordPattern)]],
      repeatPassword: ['']
    }, { validators: PasswordMatchValidator('password', 'repeatPassword') });


    this.selectedUserService.selectedUser$.subscribe(user => {
      this.activeUser = user;
      this.profileForm.patchValue({
        name: user?.name,
        email: user?.email
      });

      this.selectedUserService.getSelectedUsersCommentsAndTopics().subscribe(data => {
        this.userStats = data;
      });
    });
  }

  // { Hooks }


  // { Methods }
  changeUserData() {
    const userData = {
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value
    };

    this.http.put(`${environment.API_URL}/user/${this.activeUser?.id}`, userData).subscribe(() => {
      this.profileForm.reset();
    });

    if (this.profileForm.get('password')?.value || this.profileForm.errors) {

      const passwordData = {
        password1: this.profileForm.get('password')?.value,
        password2: this.profileForm.get('repeatPassword')?.value
      }

      this.http.put(`${environment.API_URL}/user/${this.activeUser?.id}/password`, passwordData).subscribe(() => {
        this.profileForm.reset();
      }, (error) => {
        this.setErrorMessage(error.error.message);
      });
    }
    this.selectedUserService.getUsers();
  }

  getStats(): void {
    this.selectedUserService.getSelectedUsersCommentsAndTopics();

  }
  setErrorMessage(errorMessage: string): void {
    console.log(errorMessage);
  }
}
