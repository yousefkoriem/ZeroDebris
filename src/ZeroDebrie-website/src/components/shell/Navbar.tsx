import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

export function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg text-fg">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
