'use client';
import { useUIStore } from '@/store/ui';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { Modal, ModalContent } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Icon } from '@/components/atoms/Icon';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const router = useRouter();
  
  useCommandPalette(); // registers the hotkey

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalContent className="p-0 overflow-hidden max-w-md top-[20%] translate-y-0">
        <div className="flex items-center border-b border-border px-3">
          <Icon name="Search" className="text-muted mr-2" size={18} />
          <Input 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-12 text-base rounded-none" 
            placeholder="Type a command or search..."
            autoFocus
          />
        </div>
        <div className="p-2 overflow-y-auto max-h-60">
          <div className="text-xs font-semibold text-muted mb-2 px-2">Navigation</div>
          <button onClick={() => runCommand(() => router.push('/dashboard'))} className="w-full text-left px-2 py-2 text-sm text-fg hover:bg-elevated rounded-md flex items-center gap-2">
            <Icon name="LayoutDashboard" size={16} className="text-muted" /> Go to Dashboard
          </button>
          <button onClick={() => runCommand(() => router.push('/map'))} className="w-full text-left px-2 py-2 text-sm text-fg hover:bg-elevated rounded-md flex items-center gap-2">
            <Icon name="Globe" size={16} className="text-muted" /> Open Global Map
          </button>
          <button onClick={() => runCommand(() => router.push('/spacecraft'))} className="w-full text-left px-2 py-2 text-sm text-fg hover:bg-elevated rounded-md flex items-center gap-2">
            <Icon name="Rocket" size={16} className="text-muted" /> View Fleet Status
          </button>
        </div>
      </ModalContent>
    </Modal>
  );
}
