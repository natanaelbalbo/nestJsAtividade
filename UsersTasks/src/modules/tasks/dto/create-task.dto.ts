import { TasksStatuses } from "../../../shared/utils/enums/tasks-statuses.enum";

export class CreateTaskDto {
  title: string;
  description: string;
  taskTypeId: number;
  status: TasksStatuses;
  categoryId: number;
}