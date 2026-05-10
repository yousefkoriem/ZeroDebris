import { useEffect } from 'react';
import { useUIStore } from '@/store/ui';

export function useCommandPalette() {
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const toggle = () => setOpen(!useUIStore.getState().commandPaletteOpen);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  return toggle;
}
