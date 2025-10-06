
import React from 'react';
import { Player } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrashIcon } from '../icons/TrashIcon';
import { StarIcon } from '../icons/StarIcon';

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
  onSelect: (playerId: string, isSelected: boolean) => void;
  isSelected: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete, onSelect, isSelected }) => {
  return (
    <Card className={`transition-all duration-300 ${isSelected ? 'ring-2 ring-brand-primary' : ''}`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
            <input type="checkbox" checked={isSelected} onChange={(e) => onSelect(player.id, e.target.checked)} className="form-checkbox h-5 w-5 text-brand-primary rounded focus:ring-brand-primary" />
            {player.isCaptain && <StarIcon isFilled={true} />}
        </div>
        <div className="flex-grow my-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{player.name}</h3>
            <p className="text-brand-primary font-semibold">{player.position}</p>
            <div className="mt-2 text-sm">
                <p><strong className="text-green-600 dark:text-green-400">Güçlü:</strong> {player.strengths}</p>
                <p><strong className="text-red-600 dark:text-red-400">Zayıf:</strong> {player.weaknesses}</p>
            </div>
        </div>
        <div className="flex justify-end space-x-2 mt-auto">
            <Button onClick={() => onEdit(player)} size="sm" variant="secondary">Düzenle</Button>
            <Button onClick={() => onDelete(player.id)} size="sm" variant="danger">
                <TrashIcon />
            </Button>
        </div>
      </div>
    </Card>
  );
};
