import { User } from "../modules/users/entities/user.entity";

declare global {
	namespace Express {
		export interface Request {
			user: Partial<User>
		}
	}
}
