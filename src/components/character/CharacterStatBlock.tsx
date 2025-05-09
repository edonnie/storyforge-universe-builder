
import { Progress } from '@/components/ui/progress';

interface CharacterStat {
  name: string;
  value: number;
  max?: number;
}

interface CharacterStatBlockProps {
  stats: CharacterStat[];
}

const CharacterStatBlock = ({ stats }: CharacterStatBlockProps) => {
  const maxPossibleValue = 100; // We'll use this as the max for the progress bars

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold">STATS</h3>
      <div className="space-y-4">
        {stats.map((stat, index) => {
          const statValue = typeof stat.value === 'number' ? stat.value : 0;
          const maxValue = stat.max || maxPossibleValue;
          const progressPercentage = Math.min(100, (statValue / maxValue) * 100);
          
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
