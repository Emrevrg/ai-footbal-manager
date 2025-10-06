
import React from 'react';
import { Player, Formation } from '../../types';

interface FormationDisplayProps {
  players: Player[];
  formation: Formation;
}

const formationLayouts: Record<Formation, { [key: string]: { top: string; left: string } }> = {
  '4-4-2': { GK: { top: '92%', left: '50%' }, RB: { top: '75%', left: '85%' }, LB: { top: '75%', left: '15%' }, CB1: { top: '80%', left: '65%' }, CB2: { top: '80%', left: '35%' }, RM: { top: '50%', left: '85%' }, LM: { top: '50%', left: '15%' }, CM1: { top: '55%', left: '60%' }, CM2: { top: '55%', left: '40%' }, ST1: { top: '20%', left: '60%' }, ST2: { top: '20%', left: '40%' } },
  '4-3-3': { GK: { top: '92%', left: '50%' }, RB: { top: '75%', left: '85%' }, LB: { top: '75%', left: '15%' }, CB1: { top: '80%', left: '65%' }, CB2: { top: '80%', left: '35%' }, CM1: { top: '50%', left: '50%' }, CM2: { top: '60%', left: '70%' }, CM3: { top: '60%', left: '30%' }, RW: { top: '25%', left: '85%' }, LW: { top: '25%', left: '15%' }, ST: { top: '15%', left: '50%' } },
  '3-5-2': { GK: { top: '92%', left: '50%' }, CB1: { top: '80%', left: '25%' }, CB2: { top: '80%', left: '50%' }, CB3: { top: '80%', left: '75%' }, RWB: { top: '50%', left: '90%' }, LWB: { top: '50%', left: '10%' }, CM1: { top: '55%', left: '35%' }, CM2: { top: '55%', left: '65%' }, CAM: { top: '35%', left: '50%' }, ST1: { top: '15%', left: '40%' }, ST2: { top: '15%', left: '60%' } },
  '4-2-3-1': { GK: { top: '92%', left: '50%' }, RB: { top: '75%', left: '85%' }, LB: { top: '75%', left: '15%' }, CB1: { top: '80%', left: '65%' }, CB2: { top: '80%', left: '35%' }, CDM1: { top: '65%', left: '60%' }, CDM2: { top: '65%', left: '40%' }, RAM: { top: '40%', left: '80%' }, LAM: { top: '40%', left: '20%' }, CAM: { top: '35%', left: '50%' }, ST: { top: '15%', left: '50%' } },
};

const PlayerDot: React.FC<{ name: string; position: { top: string; left: string } }> = ({ name, position }) => (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center" style={position}>
        <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white">
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <span className="text-xs font-semibold bg-black/50 text-white px-1 rounded-sm">{name}</span>
    </div>
);

export const FormationDisplay: React.FC<FormationDisplayProps> = ({ players, formation }) => {
    // A simplified mapping for demonstration
    const getPlayerForSlot = (slot: string) => {
        if (slot.startsWith('GK')) return players.find(p => p.position.startsWith('Kaleci'));
        if (slot.startsWith('CB')) return players.find(p => p.position.startsWith('Stoper'));
        // ... more complex logic needed for a real app to assign players to slots
        return players[Math.floor(Math.random() * players.length)];
    };
  
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-green-600 rounded-lg shadow-2xl p-2 border-4 border-white/50">
        {/* Pitch markings */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/50"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/50 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-2/5 h-20 border-2 border-white/50 rounded-b-xl transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-2/5 h-20 border-2 border-white/50 rounded-t-xl transform -translate-x-1/2"></div>

        {Object.entries(formationLayouts[formation]).map(([slot, pos], index) => {
            const player = players[index % players.length] || {name: '?', position: ''};
            return <PlayerDot key={slot} name={player.name} position={pos} />
        })}
    </div>
  );
};
