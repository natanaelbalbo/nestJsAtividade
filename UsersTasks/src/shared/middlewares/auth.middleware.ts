import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../../modules/users/user.repository";
import { UnauthorizedError } from "../helpers/api-erros";

type JwtPayload = {
  id: number;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError("Unauthorized");
    }

    const token = authorization.split(" ")[1];

    const { id } = jwt.verify(token, process.env.JWT_PASS ?? "") as JwtPayload;

    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { password: _, ...loggedUser } = user;

    req.user = loggedUser;

    next();
  } catch (error) {
    next(error);
  }
};
