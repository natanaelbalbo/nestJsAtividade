import { AppDataSource } from "../../../shared/database/database.config";
import { TaskType } from "../entities/task-type.entity";

export const taskTypeRepository = AppDataSource.getRepository(TaskType)
