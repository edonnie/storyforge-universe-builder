
import EditableField from '../EditableField';

interface PersonalityProps {
  personality: {
    mbti: string;
    enneagram: string;
    alignment: string;
    traits: string;
  };
  onSaveField: (field: string, value: string) => Promise<void>;
  // New alternative props format from CharacterCreation
  traits?: {
    appearance: string;
    personality: string;
    ideals: string;
    bonds: string;
    flaws: string;
  };
  onChange?: (name: string, value: string) => void;
}

const CharacterPersonality = ({ personality, onSaveField, traits, onChange }: PersonalityProps) => {
  // If we're using the new format (from CharacterCreation)
  if (traits && onChange) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Personality Traits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-lg font-medium">Appearance</label>
            <textarea
              value={traits.appearance}
              onChange={(e) => onChange('appearance', e.target.value)}
              placeholder="Physical appearance description"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-medium">Personality</label>
            <textarea
              value={traits.personality}
              onChange={(e) => onChange('personality', e.target.value)}
              placeholder="Personality traits"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-medium">Ideals</label>
            <textarea
              value={traits.ideals}
              onChange={(e) => onChange('ideals', e.target.value)}
              placeholder="Character ideals"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-medium">Bonds</label>
            <textarea
              value={traits.bonds}
              onChange={(e) => onChange('bonds', e.target.value)}
              placeholder="Character bonds"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-medium">Flaws</label>
            <textarea
              value={traits.flaws}
              onChange={(e) => onChange('flaws', e.target.value)}
              placeholder="Character flaws"
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>
      </div>
    );
  }

  // Using the original format (from CharacterSheet)
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
