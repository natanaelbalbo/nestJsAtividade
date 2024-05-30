import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../shared/helpers/api-erros";
import { categoryRepository } from "./category.repository";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "./entities/category.entity";

export class CategoryController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryRepository.find();

      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await categoryRepository.findOne({
        where: { id: Number(id) },
      })

      if (!category) {
        throw new NotFoundError("Category not found")
      }

      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, color } = req.body;

      if (!name) {
        throw new BadRequestError("Name is required");
      }

      if (!color) {
        throw new BadRequestError("Color is required");
      }

      const categoryAlreadyExists = await categoryRepository.findOne({
        where: { name },
      });

      if (categoryAlreadyExists) {
        throw new BadRequestError("Category already exists");
      }

      const createdCategory = await categoryRepository.save({
        name,
        color,
      });

      return res.status(201).json(createdCategory);
    } catch (error) {
      next(error);
    }
  }

  async createMany(req: Request, res: Response, next: NextFunction) {
    try {
      const { categories } = req.body;

      if (!categories) {
        throw new BadRequestError("Field 'categories' is required");
      }

      const createdCategories: Partial<CreateCategoryDto>[] = [];

      const queryRunner = categoryRepository.manager.connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{
        for (const category of categories) {
          const { name, color } = category;
  
          if (!name) {
            throw new BadRequestError("Name is required");
          }
  
          if (!color) {
            throw new BadRequestError("Color is required");
          }
  
          const categoryAlreadyExists = await queryRunner.manager.findOne(Category, {
            where: { name },
          });
  
          if (categoryAlreadyExists) {
            throw new BadRequestError("Category already exists");
          }
  
          const createdCategory = await queryRunner.manager.save(Category, {
            name,
            color,
          });
  
          createdCategories.push(createdCategory);
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        const errorMessages = (error as Error).message.split("\n");
        throw new BadRequestError(`Error creating categories: ${errorMessages[0]}`);
      } finally {
        await queryRunner.release();
      }

      return res.status(201).json(createdCategories);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, color } = req.body;

      if (!name) {
        throw new BadRequestError("Name is required");
      }

      if (!color) {
        throw new BadRequestError("Color is required");
      }

      const category = await categoryRepository.findOne({
        where: { id: Number(id) },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      const categoryAlreadyExists = await categoryRepository.findOne({
        where: { name },
      });

      if (categoryAlreadyExists && categoryAlreadyExists.id !== Number(id)) {
        throw new BadRequestError("Category already exists");
      }

      await categoryRepository.update(Number(id), {
        name,
        color,
      });

      const updatedCategory = await categoryRepository.findOne({
        where: { id: Number(id) },
      });

      return res.status(200).json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await categoryRepository.findOne({
        where: { id: Number(id) },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      await categoryRepository.delete(Number(id));

      return res.status(200).json({ message: "Category deleted" });
    } catch (error) {
      next(error);
    }
  }
}
