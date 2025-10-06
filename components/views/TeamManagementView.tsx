import React, { useState } from 'react';
import { Player } from '../../types';
import { PlayerCard } from '../team/PlayerCard';
import { PlayerForm } from '../team/PlayerForm';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PlusIcon } from '../icons/PlusIcon';
import { PlayerComparison } from '../team/PlayerComparison';

interface TeamManagementViewProps {
  myTeam: Player[];
  setMyTeam: React.Dispatch<React.SetStateAction<Player[]>>;
  opponentTeam: Player[];
  setOpponentTeam: React.Dispatch<React.SetStateAction<Player[]>>;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({ myTeam, setMyTeam, opponentTeam, setOpponentTeam }) => {
  const [activeTab, setActiveTab] = useState<'myTeam' | 'opponentTeam'>('myTeam');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [editingTeam, setEditingTeam] = useState<'myTeam' | 'opponentTeam'>('myTeam');
  
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  const handleSavePlayer = (player: Player) => {
    const setCurrentPlayers = editingTeam === 'myTeam' ? setMyTeam : setOpponentTeam;

    setCurrentPlayers(currentPlayers => {
        const teamWithPlayer = playerToEdit
            ? currentPlayers.map(p => (p.id === player.id ? player : p))
            : [...currentPlayers, player];
        
        if (player.isCaptain) {
            return teamWithPlayer.map(p => ({ ...p, isCaptain: p.id === player.id }));
        }
        return teamWithPlayer;
    });

    setIsModalOpen(false);
    setPlayerToEdit(null);
  };

  const handleEditPlayer = (player: Player, team: 'myTeam' | 'opponentTeam') => {
    setPlayerToEdit(player);
    setEditingTeam(team);
    setIsModalOpen(true);
  };
  
  const handleAddNewPlayer = () => {
    setPlayerToEdit(null);
    setEditingTeam(activeTab);
    setIsModalOpen(true);
  }

  const handleDeletePlayer = (playerId: string, team: 'myTeam' | 'opponentTeam') => {
    const setCurrentPlayers = team === 'myTeam' ? setMyTeam : setOpponentTeam;
    setCurrentPlayers(currentPlayers => currentPlayers.filter(p => p.id !== playerId));
  };
  
  const handlePlayerSelect = (playerId: string, isSelected: boolean) => {
    if (isSelected) {
        if(selectedPlayers.length < 2) {
            setSelectedPlayers([...selectedPlayers, playerId]);
        }
    } else {
        setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    }
  }
  
  const handleCompare = () => {
      if(selectedPlayers.length === 2) {
          setIsComparisonModalOpen(true);
      }
  }
  
  const renderPlayerList = (players: Player[], team: 'myTeam' | 'opponentTeam') => {
      if (players.length === 0) {
          return (
            <div className="text-center py-10 col-span-full">
                <p className="text-gray-500 dark:text-gray-400">Henüz bu takıma oyuncu eklenmedi.</p>
                <p className="text-gray-500 dark:text-gray-400">Yeni oyuncu eklemek için 'Yeni Oyuncu' butonunu kullanın.</p>
            </div>
          );
      }
      return (
          <>
            {players.map(player => (
                <PlayerCard 
                    key={player.id} 
                    player={player} 
                    onEdit={(p) => handleEditPlayer(p, team)} 
                    onDelete={(id) => handleDeletePlayer(id, team)}
                    onSelect={handlePlayerSelect}
                    isSelected={selectedPlayers.includes(player.id)}
                />
            ))}
          </>
      );
  }

  const TabButton: React.FC<{tab: 'myTeam' | 'opponentTeam', label: string}> = ({tab, label}) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors duration-300 ${activeTab === tab ? 'bg-white/80 dark:bg-gray-800/80 text-brand-primary' : 'bg-transparent text-gray-500 dark:text-gray-400'}`}
      >
          {label}
      </button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Takım Yönetimi</h1>
        <div className="flex items-center space-x-2">
            <Button onClick={handleCompare} disabled={selectedPlayers.length !== 2}>
                Karşılaştır ({selectedPlayers.length}/2)
            </Button>
            <Button onClick={handleAddNewPlayer}>
                <PlusIcon />
                Yeni Oyuncu
            </Button>
        </div>
      </div>

      <div className="mb-4 border-b border-gray-300 dark:border-gray-700">
          <TabButton tab="myTeam" label="Benim Takımım" />
          <TabButton tab="opponentTeam" label="Rakip Takım" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTab === 'myTeam' && renderPlayerList(myTeam, 'myTeam')}
          {activeTab === 'opponentTeam' && renderPlayerList(opponentTeam, 'opponentTeam')}
      </div>


      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setPlayerToEdit(null); }} 
        title={playerToEdit 
            ? "Oyuncuyu Düzenle" 
            : `Yeni ${editingTeam === 'myTeam' ? 'Oyuncu' : 'Rakip Oyuncu'} Ekle`
        }
      >
        <PlayerForm onSave={handleSavePlayer} playerToEdit={playerToEdit} />
      </Modal>

      <PlayerComparison 
        isOpen={isComparisonModalOpen} 
        onClose={() => setIsComparisonModalOpen(false)}
        players={[...myTeam, ...opponentTeam].filter(p => selectedPlayers.includes(p.id))}
       />
    </div>
  );
};
