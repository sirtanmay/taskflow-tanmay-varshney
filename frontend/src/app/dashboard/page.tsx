"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function DashboardPage() {
  useAuth();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        const projectsData = res.data.data || [];
        setProjects(projectsData);

        // fetch stats for all projects
        let total = 0;
        let inProgress = 0;
        let completed = 0;

        await Promise.all(
          projectsData.map(async (project: any) => {
            try {
              const statsRes = await api.get(`/projects/${project.id}/stats`);
              const data = statsRes.data?.data || statsRes.data;

              total += data.total_tasks ?? 0;
              inProgress += data.by_status?.in_progress ?? 0;
              completed += data.by_status?.done ?? 0;
            } catch (err) {
              console.error("Failed to fetch stats for project", project.id);
            }
          }),
        );

        setStats({ total, inProgress, completed });
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          TaskFlow Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">Dashboard</span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <p className="text-sm text-neutral-400">Total Tasks</p>
          <h2 className="text-2xl font-semibold mt-2">{stats.total}</h2>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <p className="text-sm text-neutral-400">In Progress</p>
          <h2 className="text-2xl font-semibold mt-2">{stats.inProgress}</h2>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <p className="text-sm text-neutral-400">Completed</p>
          <h2 className="text-2xl font-semibold mt-2">{stats.completed}</h2>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Projects</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            + New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-neutral-500">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No projects yet. Create your first project.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  window.location.href = `/projects/${project.id}`;
                }}
                className="bg-black border border-neutral-800 rounded-lg p-4 hover:border-neutral-600 transition cursor-pointer"
              >
                <h3 className="text-sm font-medium">{project.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {project.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Project</h2>

            <input
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm focus:outline-none focus:border-neutral-600"
            />

            <textarea
              placeholder="Description (optional)"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm focus:outline-none focus:border-neutral-600"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-neutral-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!newProject.name) return;

                  try {
                    setCreating(true);
                    await api.post("/projects", newProject);

                    // refetch
                    const res = await api.get("/projects");
                    setProjects(res.data.data || []);

                    setNewProject({ name: "", description: "" });
                    setIsModalOpen(false);
                  } catch (err) {
                    console.error("Create project failed", err);
                  } finally {
                    setCreating(false);
                  }
                }}
                disabled={creating}
                className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
