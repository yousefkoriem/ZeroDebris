import { create } from 'zustand'

type UIState = {
  sidebarOpen: boolean
  commandOpen: boolean
  commandPaletteOpen: boolean
  wsStatus: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED'
  theme: 'dark' | 'light'
  eolMode: boolean
  toggleSidebar: () => void
  setCommandOpen: (v: boolean) => void
  setCommandPaletteOpen: (v: boolean) => void
  setWsStatus: (s: 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED') => void
  setTheme: (t: 'dark' | 'light') => void
  setEOLMode: (v: boolean) => void
}

export const useUI = create<UIState>((set) => ({
  sidebarOpen: true,
  commandOpen: false,
  commandPaletteOpen: false,
  wsStatus: 'DISCONNECTED',
  theme: 'dark',
  eolMode: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandOpen: (v) => set({ commandOpen: v }),
  setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
  setWsStatus: (s) => set({ wsStatus: s }),
  setTheme: (t) => {
    document.documentElement.dataset.theme = t
    set({ theme: t })
  },
  setEOLMode: (v) => set({ eolMode: v }),
}))

export const useUIStore = useUI;
