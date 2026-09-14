import { Component, input, output, signal } from '@angular/core';
import { ProjectModel } from '../../../features/projects/model/project.model';
import { MemberModel } from '../../models/member.model';
import { RemoveMember } from './component/remove-member/remove-member';


@Component({
  selector: 'app-members',
  imports: [RemoveMember],
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members {
  removeMember = output<MemberModel>();
  removeAvailable = input<boolean>();
  members = input<MemberModel[]>();
  removeOpen = signal<boolean>(false);


  openRemoveMember(){
    this.removeOpen.update((value) => !value);
  }

  onRemove(member: MemberModel) {
    this.removeMember.emit(member);
  }
  project = input<ProjectModel>();

}
