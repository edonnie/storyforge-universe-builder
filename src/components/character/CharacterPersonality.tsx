
import EditableField from '../EditableField';

interface PersonalityProps {
  personality: {
    mbti: string;
    enneagram: string;
    alignment: string;
    traits: string;
  };
  onSaveField: (field: string, value: string) => Promise<void>;
}

const CharacterPersonality = ({ personality, onSaveField }: PersonalityProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Personality</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-lg font-medium">MBTI</label>
          <EditableField
            initialValue={personality.mbti}
            onSave={(value) => onSaveField('personality.mbti', value)}
            placeholder="MBTI Type"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Enneagram</label>
          <EditableField
            initialValue={personality.enneagram}
            onSave={(value) => onSaveField('personality.enneagram', value)}
            placeholder="Enneagram Type"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Alignment</label>
          <EditableField
            initialValue={personality.alignment}
            onSave={(value) => onSaveField('personality.alignment', value)}
            placeholder="Character Alignment"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Traits</label>
          <EditableField
            initialValue={personality.traits}
            onSave={(value) => onSaveField('personality.traits', value)}
            placeholder="Personality traits"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
            multiline
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterPersonality;
