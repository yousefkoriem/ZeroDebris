import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Egypt Observer-1 Mission Control',
  description: 'Mission control dashboard for the Egypt Observer-1 Earth Observation satellite',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-bg text-fg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
