import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { TeamManagementView } from './components/views/TeamManagementView';
import { StrategyView } from './components/views/StrategyView';
import { JerseyDesignerView } from './components/views/JerseyDesignerView';
import { Player } from './types';

type Theme = 'light' | 'dark';
type View = 'team' | 'strategy' | 'jersey';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [currentView, setCurrentView] = useState<View>('team');

  // Lifted state for teams
  const [myTeam, setMyTeam] = useState<Player[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Player[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case 'team':
        return <TeamManagementView 
                  myTeam={myTeam} 
                  setMyTeam={setMyTeam}
                  opponentTeam={opponentTeam}
                  setOpponentTeam={setOpponentTeam}
                />;
      case 'strategy':
        return <StrategyView myTeam={myTeam} opponentTeam={opponentTeam} />;
      case 'jersey':
        return <JerseyDesignerView />;
      default:
        return <TeamManagementView 
                  myTeam={myTeam} 
                  setMyTeam={setMyTeam}
                  opponentTeam={opponentTeam}
                  setOpponentTeam={setOpponentTeam}
                />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100 via-transparent to-blue-100 dark:from-green-900/50 dark:via-transparent dark:to-blue-900/50 -z-10"></div>
        <Layout 
            theme={theme} 
            setTheme={setTheme} 
            currentView={currentView} 
            setView={setCurrentView}
        >
            {renderView()}
        </Layout>
    </div>
  );
};

export default App;
