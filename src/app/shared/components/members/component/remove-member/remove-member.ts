import { Component, input, output } from '@angular/core';
import { MemberModel } from '../../../../models/member.model';

@Component({
  selector: 'app-remove-member',
  imports: [],
  templateUrl: './remove-member.html',
  styleUrl: './remove-member.scss',
})
export class RemoveMember {
  members = input<MemberModel[]>();
  memberToRemove = output<MemberModel>();

  onRemoveMember(member: MemberModel){
    this.memberToRemove.emit(member);
  }
}
