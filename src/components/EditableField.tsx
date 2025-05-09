
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EditableFieldProps {
  initialValue: string;
  onSave: (value: string) => Promise<void> | void;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  onSave,
  placeholder = '',
  multiline = false,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  // Update value when initialValue changes (e.g., from API)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(value);
    } catch (error) {
      console.error("Error saving field:", error);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  // Handle key events (Enter to save, Escape to cancel)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    } else if (e.key === 'Enter' && !multiline) {
      handleSave();
    }
  };

  if (isEditing) {
    return multiline ? (
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full min-h-[100px] ${className}`}
        disabled={isSaving}
        autoFocus
      />
    ) : (
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={isSaving}
        autoFocus
      />
    );
  }

  return (
    <div
      className={`cursor-text min-h-[2em] ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {value || (
        <span className="text-muted-foreground">{placeholder}</span>
      )}
    </div>
  );
};

export default EditableField;
