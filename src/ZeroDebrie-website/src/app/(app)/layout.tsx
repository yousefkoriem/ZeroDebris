import { Navbar } from '@/components/shell/Navbar';
import { CommandPalette } from '@/components/shell/CommandPalette';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Navbar>
      <CommandPalette />
      <main className="overflow-y-auto bg-bg min-h-screen p-6">
        {children}
      </main>
    </Navbar>
  );
}
