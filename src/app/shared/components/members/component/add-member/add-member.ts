import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberModel } from '../../../../models/member.model';
import { AuthService } from '../../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-add-member',
  imports: [FormsModule],
  templateUrl: './add-member.html',
  styleUrl: './add-member.scss',
})
export class AddMember {
  private authService = inject(AuthService);
  membersToAdd = output<number[]>();

  currentUser = this.authService.currentUser();
  selectedMemberIds: number[] = [];
  members = input<MemberModel[]>();


  onAddMember(){
    this.membersToAdd.emit(this.selectedMemberIds);
  }
}
