import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
} from "../../../shared/helpers/api-erros";
import { TasksStatuses } from "../../../shared/utils/enums/tasks-statuses.enum";
import { categoryRepository } from "../../categories/category.repository";
import { userRepository } from "../../users/user.repository";
import ShowTaskDto from "../dto/show-task.dto";
import { taskTypeRepository } from "../repositories/task-type.repository";
import { taskRepository } from "../repositories/task.repository";

export class TaskController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskRepository.find();

      return res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const task = await taskRepository.findOne({
        where: { id: Number(id) },
        relations: ["category", "taskType", "user"],
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      const taskDto = ShowTaskDto.build(task);

      return res.status(200).json(taskDto);
    } catch (error) {
      next(error);
    }
  }

  async findByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({
        where: { id: Number(id) },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const tasks = await taskRepository.find({
        where: { userId: Number(id) },
        relations: ["category", "taskType", "user"],
      });

      const tasksDto = tasks.map((task) => ShowTaskDto.build(task));

      return res.status(200).json(tasksDto);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, taskTypeId, statusId, categoryId } = req.body;

      if (!title || !description || !taskTypeId || !statusId) {
        throw new BadRequestError("All fields are required");
      }

      const taskType = await taskTypeRepository.findOne({
        where: { id: taskTypeId },
      });

      if (!taskType) {
        throw new NotFoundError("Task type not found");
      }

      if (!Object.values(TasksStatuses).includes(statusId)) {
        throw new BadRequestError("Invalid status");
      }

      let category;

      if (categoryId) {
        category = await categoryRepository.findOne({
          where: { id: categoryId },
        });

        if (!category) {
          throw new NotFoundError("Category not found");
        }
      }

      const conclusionDate =
        statusId === TasksStatuses.CANCELED || statusId === TasksStatuses.DONE
          ? new Date()
          : null;

      const createdTask = await taskRepository.save({
        ...req.body,
        categoryId: category?.id || null,
        taskTypeId: taskType.id,
        statusId: statusId,
        userId: req.user.id,
        creationDate: new Date().toISOString(),
        conclusionDate: conclusionDate,
      });

      const task = await taskRepository.findOne({
        where: { id: createdTask.id },
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, taskTypeId, statusId, categoryId } = req.body;

      if (!title || !description || !taskTypeId || !statusId) {
        throw new BadRequestError("All fields are required");
      }

      const task = await taskRepository.findOne({
        where: { id: Number(id) },
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      if (task.userId !== req.user.id) {
        throw new BadRequestError("You can't update this task");
      }

      const taskType = await taskTypeRepository.findOne({
        where: { id: taskTypeId },
      });

      if (!taskType) {
        throw new NotFoundError("Task type not found");
      }

      if (!Object.values(TasksStatuses).includes(statusId)) {
        throw new BadRequestError("Invalid status");
      }

      let category;

      if (categoryId) {
        category = await categoryRepository.findOne({
          where: { id: categoryId },
        });

        if (!category) {
          throw new NotFoundError("Category not found");
        }
      }

      const conclusionDate =
        statusId === TasksStatuses.CANCELED || statusId === TasksStatuses.DONE
          ? new Date()
          : null;

      await taskRepository.update(
        { id: Number(id) },
        {
          ...req.body,
          categoryId: category?.id || null,
          taskTypeId: taskType.id,
          statusId: statusId,
          conclusionDate: conclusionDate,
        }
      );

      const updatedTask = await taskRepository.findOne({
        where: { id: Number(id) },
      });

      return res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const task = await taskRepository.findOne({
        where: { id: Number(id) },
        relations: ["user"],
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      if (task.user.id !== req.user.id) {
        throw new BadRequestError("You can't delete this task");
      }

      await taskRepository.delete({ id: Number(id) });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async findByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await categoryRepository.findOne({
        where: { id: Number(id) },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      const tasks = await taskRepository.find({
        where: { categoryId: Number(id) },
        relations: ["category", "taskType", "user"],
      });

      if (!tasks.length) {
        throw new NotFoundError("Tasks not found");
      }

      const tasksDto = tasks.map((task) => ShowTaskDto.build(task));

      return res.status(200).json(tasksDto);
    } catch (error) {
      next(error);
    }
  }

  async findDoneTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskRepository.find({
        where: { statusId: Number(TasksStatuses.DONE) },
        relations: ["category", "taskType", "user"],
      });

      console.log(tasks);

      if (!tasks.length) {
        throw new NotFoundError("Tasks not found");
      }

      const tasksDto = tasks.map((task) => ShowTaskDto.build(task));

      return res.status(200).json(tasksDto);
    } catch (error) {
      next(error);
    }
  }

  async findPendingTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskRepository.find({
        where: { statusId: Number(TasksStatuses.PENDING) },
        relations: ["category", "taskType", "user"],
      });

      if (!tasks.length) {
        throw new NotFoundError("Tasks not found");
      }

      const tasksDto = tasks.map((task) => ShowTaskDto.build(task));

      return res.status(200).json(tasksDto);
    } catch (error) {
      next(error);
    }
  }

  async countUserTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({
        where: { id: Number(id) },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const tasks = await taskRepository.find({
        where: { userId: Number(id) },
      });

      return res.status(200).json({ total: tasks.length });
    } catch (error) {
      next(error);
    }
  }

  async findLastTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({
        where: { id: Number(id) },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const task = await taskRepository.findOne({
        where: { userId: Number(id) },
        order: { creationDate: "DESC" },
        relations: ["category", "taskType", "user"],
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      const taskDto = ShowTaskDto.build(task);

      return res.status(200).json(taskDto);
    } catch (error) {
      next(error);
    }
  }

  async findAverageConclusion(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskRepository.find();

      const totalTasks = tasks.length;

      const doneTasks = tasks.filter(
        (task) => task.statusId === TasksStatuses.DONE
      );

      const totalDoneTasks = doneTasks.length;

      const average =
        totalDoneTasks > 0 ? (totalDoneTasks / totalTasks) * 100 : 0;

      return res.status(200).json({ average });
    } catch (error) {
      next(error);
    }
  }

  async findLongestDescription(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await taskRepository.find();

      const longestTask = tasks.reduce((prev, current) =>
        prev.description.length > current.description.length ? prev : current
      );

      return res.status(200).json(longestTask);
    } catch (error) {
      next(error);
    }
  }

  async findOldestTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await userRepository.findOne({
        where: { id: Number(id) },
      });

      if (!user) {
        throw new NotFoundError("User not found");
      }

      const task = await taskRepository.findOne({
        where: { userId: Number(id) },
        order: { creationDate: "ASC" },
        relations: ["category", "taskType", "user"],
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      const taskDto = ShowTaskDto.build(task);

      return res.status(200).json(taskDto);
    } catch (error) {
      next(error);
    }
  }
}
