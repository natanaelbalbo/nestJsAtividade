import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../../shared/helpers/api-erros";
import { taskTypeRepository } from "../repositories/task-type.repository";
import { taskRepository } from "../repositories/task.repository";

export class TaskTypeController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const taskTypes = await taskTypeRepository.find();

      return res.status(200).json(taskTypes);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const taskType = await taskTypeRepository.findOne({
        where: { id: Number(id) },
      });

      if (!taskType) {
        throw new NotFoundError("Task Type not found");
      }

      return res.status(200).json(taskType);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new BadRequestError("Name is required");
      }

      const taskTypeAlreadyExists = await taskTypeRepository.findOne({
        where: { name },
      });

      if (taskTypeAlreadyExists) {
        throw new BadRequestError("Task Type already exists");
      }

      const createdTaskType = await taskTypeRepository.save({
        name,
      });

      return res.status(201).json(createdTaskType);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        throw new BadRequestError("Name is required");
      }

      const taskType = await taskTypeRepository.findOne({
        where: { id: Number(id) },
      });

      if (!taskType) {
        throw new NotFoundError("Task Type not found");
      }

      const taskTypeAlreadyExists = await taskTypeRepository.findOne({
        where: { name },
      });

      if (taskTypeAlreadyExists && taskTypeAlreadyExists.id !== Number(id)) {
        throw new BadRequestError("Task Type already exists");
      }

      await taskTypeRepository.update(Number(id), {
        name,
      });

      const updatedTaskType = await taskTypeRepository.findOne({
        where: { id: Number(id) },
      });

      return res.status(200).json(updatedTaskType);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const taskType = await taskTypeRepository.findOne({
        where: { id: Number(id) },
      });

      if (!taskType) {
        throw new NotFoundError("Task Type not found");
      }

      const task = await taskRepository.findOne({
        where: { taskTypeId: Number(id) },
      });

      if (task) {
        throw new BadRequestError("Task Type is being used");
      }

      await taskTypeRepository.delete(Number(id));

      return res.status(204).json({ message: "Task Type deleted" });
    } catch (error) {
      next(error);
    }
  }
}
