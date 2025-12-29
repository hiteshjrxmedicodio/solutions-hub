"use client";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

