import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createTask, getTasks, updateTask, deleteTask } from "./task.service";
import { createTaskSchema, updateTaskSchema } from "./task.schema";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createTaskSchema.parse(req.body);
    const projectId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const task = await createTask(projectId, req.user!.user_id, parsed);

    res.status(201).json({ data: task });
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to create task",
      message: err.message,
    });
  }
};

export const list = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const tasks = await getTasks(
      projectId,
      {
        status: req.query.status as string | undefined,
        assignee: req.query.assignee as string | undefined,
      },
      page,
      limit,
    );

    res.json({ data: tasks });
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to fetch tasks",
      message: err.message,
    });
  }
};

export const update = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateTaskSchema.parse(req.body);
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const task = await updateTask(taskId, req.user!.user_id, parsed);

    res.json({ data: task });
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to update task",
      message: err.message,
    });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    await deleteTask(taskId, req.user!.user_id);

    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to delete task",
      message: err.message,
    });
  }
};
