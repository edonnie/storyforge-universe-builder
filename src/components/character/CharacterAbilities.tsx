
import EditableField from '../EditableField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Ability {
  name: string;
  description: string;
  cooldown?: string;
  cost?: string;
}

interface AbilitiesProps {
  abilities?: {
    mainAbility: string;
    signatureSkills: string;
    passives: string;
  } | Ability[];
  onSaveField?: (field: string, value: string) => Promise<void>;
  onChange?: (abilities: Ability[]) => void;
}

const CharacterAbilities = ({ abilities, onSaveField, onChange }: AbilitiesProps) => {
  // If we're using the array format (from CharacterCreation)
  if (Array.isArray(abilities) && onChange) {
    const [selectedAbility, setSelectedAbility] = useState<number | null>(null);

    const handleAddAbility = () => {
      onChange([...abilities, { name: '', description: '' }]);
      setSelectedAbility(abilities.length);
    };

    const handleUpdateAbility = (index: number, field: string, value: string) => {
      const updatedAbilities = [...abilities];
      updatedAbilities[index] = { ...updatedAbilities[index], [field]: value };
      onChange(updatedAbilities);
    };

    const handleDeleteAbility = (index: number) => {
      const updatedAbilities = abilities.filter((_, i) => i !== index);
      onChange(updatedAbilities);
      setSelectedAbility(null);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Abilities & Skills</h2>
          <Button onClick={handleAddAbility}>Add Ability</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {abilities.map((ability, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-md cursor-pointer ${selectedAbility === index ? 'border-primary' : ''}`}
              onClick={() => setSelectedAbility(index)}
            >
              <div className="font-semibold">{ability.name || 'Unnamed Ability'}</div>
              <div className="text-sm text-gray-500 truncate">{ability.description?.substring(0, 50) || 'No description'}</div>
            </div>
          ))}
        </div>

        {selectedAbility !== null && selectedAbility < abilities.length && (
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Ability</h3>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteAbility(selectedAbility)}>
                Delete
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <Input
                  value={abilities[selectedAbility].name}
                  onChange={(e) => handleUpdateAbility(selectedAbility, 'name', e.target.value)}
                  placeholder="Ability name"
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <Textarea
                  value={abilities[selectedAbility].description}
                  onChange={(e) => handleUpdateAbility(selectedAbility, 'description', e.target.value)}
                  placeholder="Ability description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Cooldown</label>
                  <Input
                    value={abilities[selectedAbility].cooldown || ''}
                    onChange={(e) => handleUpdateAbility(selectedAbility, 'cooldown', e.target.value)}
                    placeholder="e.g., 2 turns"
                  />
                </div>
                <div>
                  <label className="block mb-1">Cost</label>
                  <Input
                    value={abilities[selectedAbility].cost || ''}
                    onChange={(e) => handleUpdateAbility(selectedAbility, 'cost', e.target.value)}
                    placeholder="e.g., 15 MP"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original format (used in CharacterSheet)
  if (abilities && !Array.isArray(abilities) && onSaveField) {
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
  }

  // Default empty state
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">No Abilities</h2>
      <p>No ability data available</p>
    </div>
  );
};

export default CharacterAbilities;
