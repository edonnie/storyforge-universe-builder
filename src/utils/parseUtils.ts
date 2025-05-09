
import { Character } from "../components/character/CharacterSheet";

/**
 * Detects if the text is a structured character output
 * @param text The text response from the AI
 * @returns "character" if it's a character sheet, null otherwise
 */
export const detectOutputType = (text: string): "character" | null => {
  const re = /^(NAME|RACE|JOBS|BIO|PERSONALITY|STATS):/im;
  return re.test(text) ? "character" : null;
};

/**
 * Parses structured text output from the AI into character data fields
 * @param text The structured text response from the AI
 * @param character The current character object to update
 * @returns Updated character object
 */
export const parseStructuredOutput = (text: string, character: Character): Character => {
  // Check if we have a character output
  if (!detectOutputType(text)) {
    console.warn("Input is not a recognized character output, skipping update.");
    return character;
  }

  // Create a deep copy of the current character to update
  const updatedCharacter = JSON.parse(JSON.stringify(character));

  // Helper to extract text content for any labeled section
  const extractSectionContent = (labelText: string): string => {
    const stopLabels = "NAME|RACE|JOBS|ROLE|PARENTS|STATS|PERSONALITY|BIOGRAPHY|BIO|ABILITIES|EQUIPMENT & STYLE|EQUIPMENT|NOTES|RELATIONSHIPS";
    const regex = new RegExp(`${labelText}:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${stopLabels}):\\s*|$)`, 'is');
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : "";
  };

  // Helper to extract stat number, defaults to ""
  const extractStat = (statLabel: string): string => {
    const regex = new RegExp(`${statLabel}:\\s*(\\d+)`, 'i');
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : "";
  };

  // Parse basic fields
  updatedCharacter.name = extractSectionContent("NAME");
  updatedCharacter.race = extractSectionContent("RACE");
  updatedCharacter.jobs = extractSectionContent("JOBS");
  updatedCharacter.role = extractSectionContent("ROLE");
  updatedCharacter.parents = extractSectionContent("PARENTS");
  updatedCharacter.bio = extractSectionContent("BIO") || extractSectionContent("BIOGRAPHY");
  updatedCharacter.notes = extractSectionContent("NOTES");
  updatedCharacter.relationships = extractSectionContent("RELATIONSHIPS");

  // Parse equipment section
  const equipmentSection = extractSectionContent("EQUIPMENT") || extractSectionContent("EQUIPMENT & STYLE");
  if (equipmentSection) {
    const weaponMatch = equipmentSection.match(/(?:WEAPON|WEAPONS):?\s*([^,\n]+)/i);
    const armorMatch = equipmentSection.match(/(?:ARMOR|ARMORS|ARMOUR):?\s*([^,\n]+)/i);
    
    if (weaponMatch) updatedCharacter.equipment.weapon = weaponMatch[1].trim();
    if (armorMatch) updatedCharacter.equipment.armor = armorMatch[1].trim();
  }
  
  // Direct section extraction as fallback
  updatedCharacter.equipment.weapon = updatedCharacter.equipment.weapon || extractSectionContent("WEAPON");
  updatedCharacter.equipment.armor = updatedCharacter.equipment.armor || extractSectionContent("ARMOR");
  updatedCharacter.style = extractSectionContent("STYLE");

  // Parse stats
  updatedCharacter.stats.hp = extractStat("HP");
  updatedCharacter.stats.mp = extractStat("MP");
  updatedCharacter.stats.physAttack = extractStat("PHYS ATTACK") || extractStat("PHYSICAL ATTACK") || extractStat("STR") || extractStat("STRENGTH");
  updatedCharacter.stats.physDefense = extractStat("PHYS DEFENSE") || extractStat("PHYSICAL DEFENSE") || extractStat("CON") || extractStat("CONSTITUTION");
  updatedCharacter.stats.agility = extractStat("AGILITY") || extractStat("AGI") || extractStat("DEX") || extractStat("DEXTERITY");
  updatedCharacter.stats.magicAttack = extractStat("MAGIC ATTACK") || extractStat("MAG ATTACK") || extractStat("INT") || extractStat("INTELLIGENCE");
  updatedCharacter.stats.magicDefense = extractStat("MAGIC DEFENSE") || extractStat("MAG DEFENSE") || extractStat("WIS") || extractStat("WISDOM");
  updatedCharacter.stats.resist = extractStat("RESIST") || extractStat("RESISTANCE");

  // Parse personality
  const personalityBlock = extractSectionContent("PERSONALITY");
  if (personalityBlock) {
    const mbtiMatch = personalityBlock.match(/MBTI:\s*([A-Z]{2,4})(?=\s|$)/i);
    const ennegramMatch = personalityBlock.match(/ENNEAGRAM:\s*([\d\w]+)(?=\s|$)/i);
    const alignmentMatch = personalityBlock.match(/ALIGNMENT:\s*([A-Za-z ]+?)(?=\s*TRAITS:|$)/i);
    
    if (mbtiMatch) updatedCharacter.personality.mbti = mbtiMatch[1].trim();
    if (ennegramMatch) updatedCharacter.personality.enneagram = ennegramMatch[1].trim();
    if (alignmentMatch) updatedCharacter.personality.alignment = alignmentMatch[1].trim();
    
    // Extract traits, stopping at the next section header
    const traitsMatch = personalityBlock.match(/TRAITS:\s*([\s\S]*?)(?=\n[A-Z ]+:|$)/i);
    if (traitsMatch) {
      updatedCharacter.personality.traits = traitsMatch[1].trim();
    }
  }

  // Parse abilities
  const abilitiesBlock = extractSectionContent("ABILITIES");
  if (abilitiesBlock) {
    const mainAbilityMatch = abilitiesBlock.match(/(?:MAIN[\s_-]*ABILITY|SPECIAL[\s_-]*ABILITY):\s*([^,\n]+)/i);
    if (mainAbilityMatch) updatedCharacter.abilities.mainAbility = mainAbilityMatch[1].trim();
    
    const skillsMatch = abilitiesBlock.match(/(?:SIGNATURE[\s_-]*SKILLS|SKILLS):\s*([\s\S]*?)(?=\s*(?:PASSIVE|$))/i);
    if (skillsMatch) updatedCharacter.abilities.signatureSkills = skillsMatch[1].trim();
    
    const passivesMatch = abilitiesBlock.match(/(?:PASSIVE[\s_-]*(?:ABILITIES|SKILLS)|PASSIVES):\s*([\s\S]*?)$/i);
    if (passivesMatch) updatedCharacter.abilities.passives = passivesMatch[1].trim();
  } else {
    // Try direct section extraction if abilities block not found
    updatedCharacter.abilities.mainAbility = extractSectionContent("MAIN ABILITY");
    updatedCharacter.abilities.signatureSkills = extractSectionContent("SIGNATURE SKILLS");
    updatedCharacter.abilities.passives = extractSectionContent("PASSIVES");
  }

  return updatedCharacter;
};
