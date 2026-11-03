import { type ReactNode } from 'react';
import { TopNav } from './TopNav';

interface MainLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function MainLayout({ children, showNav = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-cream-100">
      {showNav && <TopNav />}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
