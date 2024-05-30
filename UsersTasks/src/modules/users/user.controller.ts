import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../shared/helpers/api-erros";
import { userRepository } from "./user.repository";

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        throw new BadRequestError("Invalid data");
      }

      const userExists = await userRepository.findOneBy({ email });

      if (userExists) {
        throw new BadRequestError("User already exists");
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = userRepository.create({
        username,
        email,
        password: hashPassword,
      });

      await userRepository.save(newUser);

      const { password: _, ...user } = newUser;

      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findOneBy({ email });

      if (!user) {
        throw new BadRequestError("Email or password invalid");
      }

      const verifyPass = await bcrypt.compare(password, user.password);

      if (!verifyPass) {
        throw new BadRequestError("Email or password invalid");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
        expiresIn: "8h",
      });

      const { password: _, ...userLogin } = user;

      return res.status(200).json({ user: userLogin, token });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json(req.user);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, weight } = req.body;
      const { id } = req.user;

      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestError("User not found");
      }

      if (username) {
        user.username = username;
      }

      if (email) {
        user.email = email;
      }

      if (weight) {
        user.weight = weight;
      }

      await userRepository.save(user);

      const { password: _, ...userUpdated } = user;

      return res.status(200).json(userUpdated);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { old_password, new_password } = req.body;
      const { id } = req.user;

      const user = await userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestError("User not found");
      }

      const verifyPass = await bcrypt.compare(old_password, user.password);

      if (!verifyPass) {
        throw new BadRequestError("Password invalid");
      }

      const hashPassword = await bcrypt.hash(new_password, 10);

      user.password = hashPassword;

      await userRepository.save(user);

      const { password: _, ...userUpdated } = user;

      return res.status(200).json(userUpdated);
    } catch (error) {
      next(error);
    }
  }
}
