
import EditableField from '../EditableField';

interface AbilitiesProps {
  abilities: {
    mainAbility: string;
    signatureSkills: string;
    passives: string;
  };
  onSaveField: (field: string, value: string) => Promise<void>;
}

const CharacterAbilities = ({ abilities, onSaveField }: AbilitiesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Abilities</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-lg font-medium">Main Ability</label>
          <EditableField
            initialValue={abilities.mainAbility}
            onSave={(value) => onSaveField('abilities.mainAbility', value)}
            placeholder="Character's main ability"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Signature Skills</label>
          <EditableField
            initialValue={abilities.signatureSkills}
            onSave={(value) => onSaveField('abilities.signatureSkills', value)}
            placeholder="Character's signature skills"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
            multiline
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-medium">Passives</label>
          <EditableField
            initialValue={abilities.passives}
            onSave={(value) => onSaveField('abilities.passives', value)}
            placeholder="Character's passive abilities"
            className="p-2 rounded hover:bg-muted/50 border border-border/50"
            multiline
          />
        </div>
      </div>
    </div>
  );
};

export default CharacterAbilities;
