import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environments';
import { TaskItemModel } from '../../../model/task-item.model';

@Injectable({
  providedIn: 'root',
})
export class TaskItemService {


async deleteTaskItem(taskItem: TaskItemModel){
  try{
    const response = await fetch(`${environment.apiUrl}/task-items/${taskItem.id}`,{
      method: 'delete',
      credentials: 'include'
    });

    if(!response.ok){
      throw new Error("Reponse status: "+response.status);
    }
  }
  catch(error){ 
    console.error(error);
  }
}
  
}
