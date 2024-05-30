import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TasksStatuses } from "../../../shared/utils/enums/tasks-statuses.enum";
import { Category } from "../../categories/entities/category.entity";
import { User } from "../../users/entities/user.entity";
import { TaskType } from "./task-type.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  categoryId: number;

  @Column()
  taskTypeId: number;

  @Column({ type: "enum", enum: TasksStatuses })
  statusId: TasksStatuses;

  @Column()
  userId: number;

  @Column({ nullable: true})
  creationDate: string;

  @Column({ nullable: true})
  conclusionDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Category, (category) => category.tasks)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @ManyToOne(() => TaskType, (taskType) => taskType.tasks)
  @JoinColumn({ name: "taskTypeId" })
  taskType: TaskType;
}