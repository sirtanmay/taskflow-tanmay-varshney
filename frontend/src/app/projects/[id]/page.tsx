"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

export default function ProjectPage() {
  useAuth();

  const params = useParams();
  const projectId = params.id as string;

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  });
  const [creating, setCreating] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/tasks`);
        setTasks(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchTasks();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10">
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Project Tasks</h1>

        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="text-sm bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-md"
        >
          Back
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm bg-white text-black px-3 py-1.5 rounded-md ml-3"
        >
          + Add Task
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-500">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-20 text-neutral-500">
          No tasks yet. Create your first task.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-600 hover:shadow-lg transition-all duration-200 group"
            >
              <h3 className="text-sm font-semibold tracking-tight">
                {task.title}
              </h3>

              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                {task.description || "No description"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <select
                  value={task.status}
                  onChange={async (e) => {
                    const updatedStatus = e.target.value;

                    try {
                      await api.patch(`/tasks/${task.id}`, {
                        status: updatedStatus,
                      });

                      setTasks((prev) =>
                        prev.map((t) =>
                          t.id === task.id
                            ? { ...t, status: updatedStatus }
                            : t,
                        ),
                      );
                    } catch (err) {
                      console.error("Failed to update status", err);
                    }
                  }}
                  className={`text-xs px-2 py-1 rounded-full font-medium bg-neutral-900 border border-neutral-700 ${
                    task.status === "todo"
                      ? "text-yellow-400"
                      : task.status === "in_progress"
                        ? "text-blue-400"
                        : "text-green-400"
                  }`}
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority === "high"
                      ? "bg-red-500/10 text-red-400"
                      : task.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {task.priority}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTask(task);
                    setIsEditOpen(true);
                  }}
                  className="text-xs text-neutral-400 hover:text-white ml-3"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const ok = window.confirm("Delete this task?");
                    if (!ok) return;

                    (async () => {
                      try {
                        await api.delete(`/tasks/${task.id}`);
                        setTasks((prev) =>
                          prev.filter((t) => t.id !== task.id),
                        );
                      } catch (err) {
                        console.error("Failed to delete task", err);
                      }
                    })();
                  }}
                  className="text-xs text-red-400 hover:text-red-300 ml-3 opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Create Task</h2>

            <input
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm"
            />

            <textarea
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm"
            />

            <select
              value={newTask.status}
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-neutral-400"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!newTask.title) return;

                  try {
                    setCreating(true);

                    await api.post(`/projects/${projectId}/tasks`, newTask);

                    const res = await api.get(`/projects/${projectId}/tasks`);
                    setTasks(res.data.data || []);

                    setNewTask({
                      title: "",
                      description: "",
                      status: "todo",
                      priority: "medium",
                    });

                    setIsModalOpen(false);
                  } catch (err) {
                    console.error("Create task failed", err);
                  } finally {
                    setCreating(false);
                  }
                }}
                disabled={creating}
                className="bg-white text-black px-4 py-2 rounded-md text-sm disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && editingTask && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

            <input
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm"
            />

            <textarea
              value={editingTask.description || ""}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
              className="w-full mb-3 px-3 py-2 bg-black border border-neutral-800 rounded-md text-sm"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-sm text-neutral-400"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await api.patch(`/tasks/${editingTask.id}`, {
                      title: editingTask.title,
                      description: editingTask.description,
                    });

                    setTasks((prev) =>
                      prev.map((t) =>
                        t.id === editingTask.id ? editingTask : t,
                      ),
                    );

                    setIsEditOpen(false);
                  } catch (err) {
                    console.error("Failed to update task", err);
                  }
                }}
                className="bg-white text-black px-4 py-2 rounded-md text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
