
import React, { useState, useEffect } from 'react';
import { Player, Position } from '../../types';
import { POSITIONS } from '../../constants';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface PlayerFormProps {
  onSave: (player: Player) => void;
  playerToEdit?: Player | null;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onSave, playerToEdit }) => {
  const [player, setPlayer] = useState<Omit<Player, 'id'>>({
    name: '',
    position: Position.GK,
    strengths: '',
    weaknesses: '',
    isCaptain: false,
  });

  useEffect(() => {
    if (playerToEdit) {
      setPlayer(playerToEdit);
    } else {
      setPlayer({ name: '', position: Position.GK, strengths: '', weaknesses: '', isCaptain: false });
    }
  }, [playerToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPlayer(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCaptainToggle = (isCaptain: boolean) => {
    setPlayer(prev => ({ ...prev, isCaptain }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player.name && player.strengths && player.weaknesses) {
      onSave({
        ...player,
        id: playerToEdit?.id || new Date().toISOString(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Oyuncu Adı" id="name" name="name" value={player.name} onChange={handleChange} required />
      <Select label="Mevki" id="position" name="position" value={player.position} onChange={handleChange}>
        {POSITIONS.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </Select>
      <Textarea label="Güçlü Yönleri" id="strengths" name="strengths" value={player.strengths} onChange={handleChange} required placeholder="Örn: Hızlı, iyi şut çeker, lider ruhlu"/>
      <Textarea label="Zayıf Yönleri" id="weaknesses" name="weaknesses" value={player.weaknesses} onChange={handleChange} required placeholder="Örn: Çabuk yorulur, hava toplarında zayıf"/>
      <ToggleSwitch label="Kaptan Yap" enabled={player.isCaptain || false} onChange={handleCaptainToggle} />
      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary">{playerToEdit ? 'Oyuncuyu Güncelle' : 'Oyuncu Ekle'}</Button>
      </div>
    </form>
  );
};
