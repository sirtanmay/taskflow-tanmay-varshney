import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createProjectSchema } from "./project.schema";
import { createProject, getProjects, getProjectStats } from "./project.service";

export const create = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createProjectSchema.parse(req.body);

    const project = await createProject(req.user!.user_id, parsed);

    res.status(201).json({
      data: project,
    });
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to create project",
      message: err.message,
    });
  }
};

export const list = async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const projects = await getProjects(req.user!.user_id, page, limit);

  res.json({ data: projects });
};

export const stats = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const data = await getProjectStats(projectId, req.user!.user_id);

    res.json({ data });
  } catch (err: any) {
    res.status(400).json({
      error: "Failed to fetch project stats",
      message: err.message,
    });
  }
};
