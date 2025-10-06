
import React from 'react';
import { CloseIcon } from '../icons/CloseIcon';

type View = 'team' | 'strategy' | 'jersey';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentView: View;
  setView: (view: View) => void;
}

const NavLink: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`block px-4 py-3 rounded-lg text-lg transition-all duration-300 ${
        isActive
          ? 'bg-brand-primary text-white shadow-lg'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </a>
  );

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentView, setView }) => {
    const handleSetView = (view: View) => {
        setView(view);
        if (window.innerWidth < 768) { // close sidebar on mobile after navigation
            toggleSidebar();
        }
    }
  return (
    <>
        <aside className={`fixed top-0 left-0 z-50 w-64 h-full transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-r border-white/20 md:block`}>
          <div className="p-4">
              <div className="flex justify-between items-center md:hidden mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menü</h2>
                <button onClick={toggleSidebar}>
                    <CloseIcon />
                </button>
              </div>
            <nav className="space-y-2">
                <NavLink label="Takım Yönetimi" isActive={currentView === 'team'} onClick={() => handleSetView('team')} />
                <NavLink label="Strateji Panosu" isActive={currentView === 'strategy'} onClick={() => handleSetView('strategy')} />
                <NavLink label="Forma Tasarımcısı" isActive={currentView === 'jersey'} onClick={() => handleSetView('jersey')} />
            </nav>
          </div>
        </aside>
        {isOpen && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={toggleSidebar}></div>}
    </>
  );
};
