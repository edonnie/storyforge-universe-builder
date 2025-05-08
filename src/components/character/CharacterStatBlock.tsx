
import EditableField from '../EditableField';

interface StatBlockProps {
  stats: {
    hp: string;
    mp: string;
    physAttack: string;
    physDefense: string;
    agility: string;
    magicAttack: string;
    magicDefense: string;
    resist: string;
  };
  onSaveField: (field: string, value: string) => Promise<void>;
}

const CharacterStatBlock = ({ stats, onSaveField }: StatBlockProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-lg font-medium">HP</label>
          <EditableField
            initialValue={stats.hp}
            onSave={(value) => onSaveField('stats.hp', value)}
            placeholder="Hit Points"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">MP</label>
          <EditableField
            initialValue={stats.mp}
            onSave={(value) => onSaveField('stats.mp', value)}
            placeholder="Magic Points"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Phys Attack</label>
          <EditableField
            initialValue={stats.physAttack}
            onSave={(value) => onSaveField('stats.physAttack', value)}
            placeholder="Physical Attack"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Phys Defense</label>
          <EditableField
            initialValue={stats.physDefense}
            onSave={(value) => onSaveField('stats.physDefense', value)}
            placeholder="Physical Defense"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Agility</label>
          <EditableField
            initialValue={stats.agility}
            onSave={(value) => onSaveField('stats.agility', value)}
            placeholder="Agility"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Magic Attack</label>
          <EditableField
            initialValue={stats.magicAttack}
            onSave={(value) => onSaveField('stats.magicAttack', value)}
            placeholder="Magic Attack"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Magic Defense</label>
          <EditableField
            initialValue={stats.magicDefense}
            onSave={(value) => onSaveField('stats.magicDefense', value)}
            placeholder="Magic Defense"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Resist</label>
          <EditableField
            initialValue={stats.resist}
            onSave={(value) => onSaveField('stats.resist', value)}
            placeholder="Resistance"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterStatBlock;
