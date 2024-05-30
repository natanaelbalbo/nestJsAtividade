import express from 'express';
import { authRoutes } from './routes/auth.routes';
import { categoryRoutes } from './routes/category.routes';
import { taskTypeRoutes } from './routes/task-type.route';
import { taskRoutes } from './routes/task.route';
import { AppDataSource } from './src/shared/database/database.config';
import { errorMiddleware } from './src/shared/middlewares/error.middleware';

class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middleware();
    this.database();
    this.routes();
    this.errorHandling();
  }

  private middleware(): void {
    this.express.use(express.json());
  }

  private async database() {
    AppDataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
      });
  }

  private routes(): void {
    this.express.use(authRoutes);
    this.express.use(categoryRoutes);
    this.express.use(taskTypeRoutes);
    this.express.use(taskRoutes);
  }

  private errorHandling(): void {
    this.express.use(errorMiddleware);
  }
}

export default new App().express;
