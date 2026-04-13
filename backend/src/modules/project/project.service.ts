import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProject = async (
  userId: string,
  data: { name: string; description?: string },
) => {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      owner_id: userId,
    },
  });
};

export const getProjects = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  return prisma.project.findMany({
    where: {
      OR: [
        { owner_id: userId },
        {
          tasks: {
            some: {
              assignee_id: userId,
            },
          },
        },
      ],
    },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });
};

export const getProjectStats = async (projectId: string, userId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.owner_id !== userId) {
    throw new Error("Forbidden");
  }

  const totalTasks = await prisma.task.count({
    where: { project_id: projectId },
  });

  const statusCounts = await prisma.task.groupBy({
    by: ["status"],
    where: { project_id: projectId },
    _count: true,
  });

  const assigneeCounts = await prisma.task.groupBy({
    by: ["assignee_id"],
    where: { project_id: projectId },
    _count: true,
  });

  return {
    total_tasks: totalTasks,
    by_status: statusCounts.reduce(
      (acc, curr) => {
        acc[curr.status] = curr._count;
        return acc;
      },
      {} as Record<string, number>,
    ),

    by_assignee: assigneeCounts.map((a) => ({
      user_id: a.assignee_id ?? "unassigned",
      count: a._count,
    })),
  };
};
