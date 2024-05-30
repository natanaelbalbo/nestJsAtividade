import { AppDataSource } from "../../../shared/database/database.config";
import { Task } from "../entities/task.entity";

export const taskRepository = AppDataSource.getRepository(Task)
