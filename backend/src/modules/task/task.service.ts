import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (
  projectId: string,
  userId: string,
  data: any,
) => {
  // ensure project exists & user owns it
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.owner_id !== userId) {
    throw new Error("Forbidden");
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || "todo",
      priority: data.priority || "medium",
      assignee_id: data.assignee_id,
      due_date: data.due_date ? new Date(data.due_date) : null,

      project: {
        connect: { id: projectId },
      },

      creator: {
        connect: { id: userId },
      },
    },
  });
};

export const getTasks = async (
  projectId: string,
  filters: { status?: string; assignee?: string },
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  return prisma.task.findMany({
    where: {
      project_id: projectId,
      status: filters.status as any,
      assignee_id: filters.assignee,
    },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });
};

export const updateTask = async (taskId: string, userId: string, data: any) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.owner_id !== userId && task.created_by !== userId) {
    throw new Error("Forbidden");
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
      ...(data.assignee_id !== undefined && { assignee_id: data.assignee_id }),
      ...(data.due_date && { due_date: new Date(data.due_date) }),
    },
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: true },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.owner_id !== userId && task.created_by !== userId) {
    throw new Error("Forbidden");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};
