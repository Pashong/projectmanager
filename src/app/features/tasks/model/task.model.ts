import { MemberModel } from "../../../shared/models/member.model"
import { TaskItemModel } from "./task-item.model"

export interface TaskModel {
    id: number,
    project_id: number,
    title: string,
    description: string,
    status: string,
    deadline: string,
    members: MemberModel[],
    task_items: TaskItemModel[],
    checkedAmount: number
}
