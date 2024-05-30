import { AppDataSource } from "../../shared/database/database.config";
import { User } from "./entities/user.entity";

export const userRepository = AppDataSource.getRepository(User)
