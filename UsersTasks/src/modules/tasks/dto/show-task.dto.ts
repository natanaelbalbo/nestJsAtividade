import { Task } from "../entities/task.entity";

interface ITaskUserDto {
  id: number;
  username: string;
  email: string;
  weight: number;
}

interface ITaskCategoryDto {
  id: number;
  name: string;
  color: string;
}

interface ITaskTypeDto {
  id: number;
  name: string;
}

interface IShowTaskDto {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  taskTypeId: number;
  statusId: number;
  userId: number;
  creationDate: string;
  conclusionDate: string;
  createdAt: Date;
  updatedAt: Date;
  category: ITaskCategoryDto;
  taskType: ITaskTypeDto;
  user: ITaskUserDto;
}

class ShowTaskDto {
  static build(task: Task): IShowTaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      categoryId: task.categoryId,
      taskTypeId: task.taskTypeId,
      statusId: task.statusId,
      userId: task.userId,
      creationDate: task.creationDate,
      conclusionDate: task.conclusionDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      category: {
        id: task.category.id,
        name: task.category.name,
        color: task.category.color,
      },
      taskType: {
        id: task.taskType.id,
        name: task.taskType.name,
      },
      user: {
        id: task.user.id,
        username: task.user.username,
        email: task.user.email,
        weight: task.user.weight,
      },
    };
  }
}

export default ShowTaskDto;