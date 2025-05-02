import { AdminSidebar } from "./admin-sidebar";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
}

export function AdminShell({ children, title }: AdminShellProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}