import { MemberModel } from "../../../shared/models/member.model";

export interface ProjectModel {
  id: number,
  title: string,
  description: string,
  status: string,
  deadline: Date,
  members: MemberModel[],
}
