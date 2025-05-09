
import { Progress } from '@/components/ui/progress';

export interface CharacterStat {
  name: string;
  value: number;
  max?: number;
}

interface CharacterStatObject {
  hp: string;
  mp: string;
  physAttack: string;
  physDefense: string;
  agility: string;
  magicAttack: string;
  magicDefense: string;
  resist: string;
}

interface CharacterStatBlockProps {
  stats: CharacterStat[] | CharacterStatObject;
  onSaveField?: (field: string, value: string) => Promise<void>;
}

const CharacterStatBlock = ({ stats, onSaveField }: CharacterStatBlockProps) => {
  const maxPossibleValue = 100; // We'll use this as the max for the progress bars
  
  // Convert the stats object to an array if it's not already
  const statsArray = Array.isArray(stats) 
    ? stats 
    : Object.entries(stats).map(([key, value]) => ({
        name: key === 'physAttack' ? 'Phys Atk' : 
              key === 'physDefense' ? 'Phys Def' : 
              key === 'magicAttack' ? 'Mag Atk' : 
              key === 'magicDefense' ? 'Mag Def' : 
              key.charAt(0).toUpperCase() + key.slice(1),
        value: parseInt(value, 10) || 0
      }));

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold">STATS</h3>
      <div className="space-y-4">
        {statsArray.map((stat, index) => {
          // Ensure statValue is a number
          const statValue = typeof stat.value === 'number' ? stat.value : 0;
          
          // Use the max property if it exists, otherwise use the maxPossibleValue
          // Ensure the max value is explicitly converted to a number
          const maxValue = 'max' in stat && typeof stat.max === 'number' ? stat.max : maxPossibleValue;
          
          // Calculate percentage, ensuring both operands are numbers
          const progressPercentage = Math.min(100, Math.round((statValue / maxValue) * 100));
          
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="w-20 flex-shrink-0 font-medium">{stat.name}</div>
              <div className="flex-grow">
                <Progress className="h-2.5" value={progressPercentage} />
              </div>
              <div className="w-8 text-right">{statValue}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterStatBlock;
