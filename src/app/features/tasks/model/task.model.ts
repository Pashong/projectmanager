import { MemberModel } from "../../../shared/models/member.model"

export interface TaskModel {
    id: number,
    project_id: number,
    title: string,
    description: string,
    status: string,
    deadline: string,
    members: MemberModel[]
}
