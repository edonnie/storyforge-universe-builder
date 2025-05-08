
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface EditableFieldProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

const EditableField = ({ 
  initialValue, 
  onSave, 
  className = '', 
  placeholder = 'Click to edit', 
  multiline = false 
}: EditableFieldProps) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // Place cursor at the end
      const selection = window.getSelection();
      const range = document.createRange();
      
      if (selection && inputRef.current.childNodes[0]) {
        range.selectNodeContents(inputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, [isEditing]);
  
  const handleBlur = async () => {
    if (inputRef.current) {
      const newValue = inputRef.current.innerText;
      
      // Only save if value has changed
      if (newValue !== initialValue) {
        setIsSaving(true);
        try {
          await onSave(newValue);
          setValue(newValue);
          toast({
            description: "Saved successfully",
            duration: 2000,
          });
        } catch (error) {
          console.error('Failed to save:', error);
          toast({
            title: "Error saving",
            description: "Your changes couldn't be saved",
            variant: "destructive",
          });
          // Restore original value
          setValue(initialValue);
        } finally {
          setIsSaving(false);
        }
      }
    }
    setIsEditing(false);
  };
  
  return (
    <div 
      className={`relative group ${className}`}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      <div
        ref={inputRef}
        contentEditable={isEditing}
        onBlur={handleBlur}
        className={`
          outline-none border border-transparent transition-all
          ${isEditing ? 'border border-primary/50 rounded p-1' : ''}
          ${value ? '' : 'text-muted-foreground italic'}
          ${multiline ? 'min-h-[100px]' : 'whitespace-nowrap overflow-hidden text-ellipsis'}
        `}
        suppressContentEditableWarning={true}
      >
        {value || placeholder}
      </div>
      
      {isSaving && (
        <div className="absolute right-2 top-2 text-xs text-muted-foreground">
          Saving...
        </div>
      )}
      
      {!isEditing && !isSaving && (
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground">
          Click to edit
        </div>
      )}
    </div>
  );
};

export default EditableField;
