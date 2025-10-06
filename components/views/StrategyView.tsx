import React, { useState } from 'react';
import { Player, Formation } from '../../types';
import { FORMATIONS } from '../../constants';
import { generateStrategy, generateAutomaticStrategy } from '../../services/geminiService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Select } from '../ui/Select';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Loader } from '../ui/Loader';
import { FormationDisplay } from '../strategy/FormationDisplay';

const ReactMarkdown: React.FC<{ children: string }> = ({ children }) => {
    const formatText = (text: string) => {
        return text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h4 key={index} className="text-lg font-semibold mt-3 mb-1">{line.substring(4)}</h4>;
                }
                if (line.startsWith('## ')) {
                    return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.substring(3)}</h3>;
                }
                 if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.slice(2, -2)}</h3>;
                }
                if (line.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc">{line.slice(2)}</li>;
                }
                return <p key={index} className="mb-2">{line}</p>;
            });
    };

    return <>{formatText(children)}</>;
};

interface StrategyViewProps {
  myTeam: Player[];
  opponentTeam: Player[];
}

export const StrategyView: React.FC<StrategyViewProps> = ({ myTeam, opponentTeam }) => {
  const [mode, setMode] = useState<'automatic' | 'manual'>('manual');
  const [useOpponentTeam, setUseOpponentTeam] = useState(false);
  const [formation, setFormation] = useState<Formation>('4-4-2');
  const [strategy, setStrategy] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStrategy = async () => {
    setIsLoading(true);
    setStrategy('');
    const opponentData = (mode === 'manual' && useOpponentTeam && opponentTeam.length > 0) || (mode === 'automatic' && opponentTeam.length > 0) ? opponentTeam : undefined;
    
    let result = '';
    if (mode === 'automatic') {
      result = await generateAutomaticStrategy(myTeam, opponentData);
      const formationMatch = result.match(/(\d-\d-\d(?:-\d)?)/);
      if (formationMatch && FORMATIONS.includes(formationMatch[1] as Formation)) {
        setFormation(formationMatch[1] as Formation);
      }
    } else {
      result = await generateStrategy(myTeam, formation, opponentData);
    }

    setStrategy(result);
    setIsLoading(false);
  };

  const ModeButton: React.FC<{label:string, currentMode: 'automatic' | 'manual', targetMode: 'automatic' | 'manual'}> = ({label, currentMode, targetMode}) => (
      <button 
        onClick={() => setMode(targetMode)}
        className={`flex-1 px-3 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${currentMode === targetMode ? 'bg-white dark:bg-gray-900 shadow text-brand-primary' : 'text-gray-600 dark:text-gray-300'}`}
      >{label}</button>
  );

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Strateji Panosu</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Ayarlar</h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                           <ModeButton label="Manuel" currentMode={mode} targetMode='manual'/>
                           <ModeButton label="Otomatik" currentMode={mode} targetMode='automatic'/>
                        </div>

                        {mode === 'manual' && (
                            <>
                                <Select label="Diziliş Seç" value={formation} onChange={(e) => setFormation(e.target.value as Formation)}>
                                    {FORMATIONS.map(f => <option key={f} value={f}>{f}</option>)}
                                </Select>
                                <ToggleSwitch label="Rakip Takım Analizi" enabled={useOpponentTeam} onChange={setUseOpponentTeam} />
                                {useOpponentTeam && opponentTeam.length === 0 && <p className="text-sm text-yellow-500 text-center">Analiz için rakip takımda oyuncu bulunmuyor.</p>}
                            </>
                        )}
                        {mode === 'automatic' && (
                             <p className="text-sm text-gray-500 dark:text-gray-400 text-center p-2">AI, takımınıza en uygun dizilişi ve stratejiyi otomatik olarak belirleyecektir.</p>
                        )}

                        <Button onClick={handleGenerateStrategy} disabled={isLoading || myTeam.length === 0} className="w-full">
                            {isLoading ? 'Oluşturuluyor...' : 'Strateji Oluştur'}
                        </Button>
                        {myTeam.length === 0 && <p className="text-sm text-red-500 text-center">Strateji oluşturmak için önce takımınıza oyuncu eklemelisiniz.</p>}
                    </div>
                </Card>

                 <Card>
                    <h2 className="text-xl font-bold mb-4">Saha Dizilişi</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{mode === 'automatic' ? 'AI Tarafından Önerilen Diziliş' : 'Seçilen Diziliş'}</p>
                    <FormationDisplay players={myTeam} formation={formation} />
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <h2 className="text-xl font-bold mb-4">AI Taktik Raporu</h2>
                    {isLoading && <Loader />}
                    {!isLoading && !strategy && <p className="text-gray-500 dark:text-gray-400">Strateji oluşturmak için yukarıdaki ayarları kullanın.</p>}
                    {!isLoading && strategy && (
                         <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                           <ReactMarkdown>{strategy}</ReactMarkdown>
                         </div>
                    )}
                </Card>
            </div>
        </div>
    </div>
  );
};