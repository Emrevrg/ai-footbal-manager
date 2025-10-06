
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type View = 'team' | 'strategy' | 'jersey';

interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  currentView: View;
  setView: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, theme, setTheme, currentView, setView }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={toggleSidebar} theme={theme} setTheme={setTheme} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} currentView={currentView} setView={setView} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:ml-64 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
             {children}
            </div>
        </main>
      </div>
    </div>
  );
};
