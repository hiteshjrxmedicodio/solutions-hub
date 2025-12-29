"use client";

import { useRouter } from "next/navigation";
import { DashboardCard } from "./DashboardCard";

interface Project {
  id: string;
  title: string;
  category?: string[];
  status: string;
}

interface ActiveProjectsProps {
  projects: Project[];
}

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <DashboardCard className="h-full flex flex-col">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">Active Projects</h3>
        <p className="text-sm text-zinc-500 text-center py-4 flex-1">No active projects</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="h-full flex flex-col">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">Active Projects</h3>
      <div className="space-y-3 flex-1">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`/listings/${project.id}`)}
            className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">{project.title}</p>
              <p className="text-xs text-zinc-500 mt-1">
                {project.category?.join(", ") || "No category"}
              </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              project.status === "in_progress" ? "bg-blue-100 text-blue-700" :
              project.status === "completed" ? "bg-green-100 text-green-700" :
              "bg-zinc-100 text-zinc-500"
            }`}>
              {project.status === "in_progress" ? "In Progress" : project.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}

