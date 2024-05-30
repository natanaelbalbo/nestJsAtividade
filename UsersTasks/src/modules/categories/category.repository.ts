import { AppDataSource } from "../../shared/database/database.config";
import { Category } from "./entities/category.entity";

export const categoryRepository = AppDataSource.getRepository(Category)
