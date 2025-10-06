
import React, { useState, useEffect } from 'react';
import { Player } from '../../types';
import { comparePlayers } from '../../services/geminiService';
import { Modal } from '../ui/Modal';
import { Loader } from '../ui/Loader';

interface PlayerComparisonProps {
  players: Player[];
  isOpen: boolean;
  onClose: () => void;
}

const ReactMarkdown: React.FC<{ children: string }> = ({ children }) => {
    const formatText = (text: string) => {
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.slice(2, -2)}</h3>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc">{line.slice(2)}</li>;
                }
                 if (line.startsWith('- ')) {
                    return <li key={index} className="ml-5 list-disc">{line.slice(2)}</li>;
                }
                return <p key={index} className="mb-2">{line}</p>;
            });
    };

    return <>{formatText(children)}</>;
};

export const PlayerComparison: React.FC<PlayerComparisonProps> = ({ players, isOpen, onClose }) => {
  const [comparison, setComparison] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && players.length === 2) {
      const fetchComparison = async () => {
        setIsLoading(true);
        setComparison('');
        const result = await comparePlayers(players[0], players[1]);
        setComparison(result);
        setIsLoading(false);
      };
      fetchComparison();
    }
  }, [isOpen, players]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Oyuncu Karşılaştırması">
      {isLoading && <Loader />}
      {!isLoading && comparison && (
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <ReactMarkdown>{comparison}</ReactMarkdown>
        </div>
      )}
       {!isLoading && !comparison && (
         <p>Karşılaştırma sonucu yükleniyor...</p>
      )}
    </Modal>
  );
};
