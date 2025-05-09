
import { Character } from "../components/character/CharacterSheet";

/**
 * Detects if the text is a structured character output
 * @param text The text response from the AI
 * @returns "character" if it's a character sheet, null otherwise
 */
export const detectOutputType = (text: string): "character" | null => {
  // More robust detection that looks for multiple key sections
  const characterSectionKeywords = /^(?:NAME|RACE|JOBS|ROLE|CLASS|BIOGRAPHY|BIO|PERSONALITY):/im;
  return characterSectionKeywords.test(text) ? "character" : null;
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
    // Include all possible section headers to properly detect section boundaries
    const stopLabels = "NAME|RACE|JOBS|ROLE|CLASS|PARENTS|STATS|PERSONALITY|BIOGRAPHY|BIO|ABILITIES|EQUIPMENT & STYLE|EQUIPMENT|NOTES|RELATIONSHIPS|WEAPON|ARMOR|STYLE|MAIN ABILITY|SIGNATURE SKILLS|PASSIVES";
    const regex = new RegExp(`${labelText}:\\s*([\\s\\S]*?)(?=\\n\\s*(?:${stopLabels}):\\s*|$)`, 'is');
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : "";
  };

  // Helper to extract stat number, defaults to the existing value or empty string
  const extractStat = (statLabel: string): string => {
    const regex = new RegExp(`${statLabel}:\\s*(\\d+)`, 'i');
    const match = text.match(regex);
    return match && match[1] ? match[1].trim() : updatedCharacter.stats[statLabel.toLowerCase()] || "";
  };

  // Parse basic fields with fallbacks to alternative labels
  updatedCharacter.name = extractSectionContent("NAME");
  updatedCharacter.race = extractSectionContent("RACE");
  updatedCharacter.jobs = extractSectionContent("JOBS") || extractSectionContent("CLASS");
  updatedCharacter.role = extractSectionContent("ROLE");
  updatedCharacter.parents = extractSectionContent("PARENTS");
  updatedCharacter.bio = extractSectionContent("BIO") || extractSectionContent("BIOGRAPHY");
  updatedCharacter.notes = extractSectionContent("NOTES");
  updatedCharacter.relationships = extractSectionContent("RELATIONSHIPS");

  // Parse equipment section with multiple approaches
  // First try dedicated sections
  const weaponSection = extractSectionContent("WEAPON");
  const armorSection = extractSectionContent("ARMOR");
  const styleSection = extractSectionContent("STYLE");
  
  if (weaponSection) updatedCharacter.equipment.weapon = weaponSection;
  if (armorSection) updatedCharacter.equipment.armor = armorSection;
  if (styleSection) updatedCharacter.style = styleSection;
  
  // Then try the combined equipment section if needed
  const equipmentSection = extractSectionContent("EQUIPMENT") || extractSectionContent("EQUIPMENT & STYLE");
  if (equipmentSection && (!weaponSection || !armorSection)) {
    console.log("Parsing equipment section:", equipmentSection);
    
    // Look for weapon in the equipment section if not found earlier
    if (!weaponSection) {
      const weaponMatch = equipmentSection.match(/(?:WEAPON|WEAPONS)(?:\s*:|:?\s*)([^,\n]+)/i);
      if (weaponMatch) {
        updatedCharacter.equipment.weapon = weaponMatch[1].trim();
      }
    }
    
    // Look for armor in the equipment section if not found earlier
    if (!armorSection) {
      const armorMatch = equipmentSection.match(/(?:ARMOR|ARMORS|ARMOUR)(?:\s*:|:?\s*)([^,\n]+)/i);
      if (armorMatch) {
        updatedCharacter.equipment.armor = armorMatch[1].trim();
      }
    }
    
    // If we still don't have style, look for it in equipment section
    if (!styleSection) {
      const styleMatch = equipmentSection.match(/(?:STYLE|APPEARANCE)(?:\s*:|:?\s*)([^,\n]+)/i);
      if (styleMatch) {
        updatedCharacter.style = styleMatch[1].trim();
      } else if (equipmentSection.includes("STYLE") || equipmentSection.includes("APPEARANCE")) {
        // If the section mentions style but we couldn't extract it with regex,
        // just use the whole section after removing weapon and armor parts
        let remainingText = equipmentSection
          .replace(/(?:WEAPON|WEAPONS)(?:\s*:|:?\s*)([^,\n]+)/i, '')
          .replace(/(?:ARMOR|ARMORS|ARMOUR)(?:\s*:|:?\s*)([^,\n]+)/i, '')
          .trim();
        
        // Only if we have remaining text and it's not just "STYLE:"
        if (remainingText && !remainingText.match(/^(?:STYLE|APPEARANCE)(?:\s*:|:?\s*)$/i)) {
          updatedCharacter.style = remainingText.replace(/(?:STYLE|APPEARANCE)(?:\s*:|:?\s*)/i, '').trim();
        }
      }
    }
  }

  // Parse stats with fallbacks to alternative names
  updatedCharacter.stats.hp = extractStat("HP") || extractStat("HEALTH") || extractStat("HIT POINTS");
  updatedCharacter.stats.mp = extractStat("MP") || extractStat("MANA") || extractStat("MAGIC POINTS");
  updatedCharacter.stats.physAttack = extractStat("PHYS ATTACK") || extractStat("PHYSICAL ATTACK") || extractStat("STR") || extractStat("STRENGTH");
  updatedCharacter.stats.physDefense = extractStat("PHYS DEFENSE") || extractStat("PHYSICAL DEFENSE") || extractStat("CON") || extractStat("CONSTITUTION");
  updatedCharacter.stats.agility = extractStat("AGILITY") || extractStat("AGI") || extractStat("DEX") || extractStat("DEXTERITY");
  updatedCharacter.stats.magicAttack = extractStat("MAGIC ATTACK") || extractStat("MAG ATTACK") || extractStat("INT") || extractStat("INTELLIGENCE");
  updatedCharacter.stats.magicDefense = extractStat("MAGIC DEFENSE") || extractStat("MAG DEFENSE") || extractStat("WIS") || extractStat("WISDOM");
  updatedCharacter.stats.resist = extractStat("RESIST") || extractStat("RESISTANCE") || extractStat("RES");

  // Parse personality
  const personalityBlock = extractSectionContent("PERSONALITY");
  if (personalityBlock) {
    console.log("Parsing personality block:", personalityBlock);
    
    // Extract MBTI, Enneagram, and Alignment with various formats
    const mbtiMatch = personalityBlock.match(/(?:MBTI|TYPE):\s*([A-Z]{2,4})(?=\s|$|,)/i);
    const ennegramMatch = personalityBlock.match(/(?:ENNEAGRAM):\s*([\d\w-]+)(?=\s|$|,)/i);
    const alignmentMatch = personalityBlock.match(/(?:ALIGNMENT):\s*([A-Za-z ]+?)(?=\s*(?:TRAITS|MBTI|ENNEAGRAM|TYPE):|$|,)/i);
    
    if (mbtiMatch) updatedCharacter.personality.mbti = mbtiMatch[1].trim();
    if (ennegramMatch) updatedCharacter.personality.enneagram = ennegramMatch[1].trim();
    if (alignmentMatch) updatedCharacter.personality.alignment = alignmentMatch[1].trim();
    
    // Extract traits, stopping at the next section header
    const traitsMatch = personalityBlock.match(/TRAITS:\s*([\s\S]*?)(?=\n[A-Z ]+:|$)/i);
    if (traitsMatch) {
      updatedCharacter.personality.traits = traitsMatch[1].trim();
    } else if (personalityBlock) {
      // If no explicit traits section but we have personality data,
      // extract the remaining text after the defined parts as traits
      let remainingText = personalityBlock
        .replace(/(?:MBTI|TYPE):\s*([A-Z]{2,4})(?=\s|$|,)/i, '')
        .replace(/(?:ENNEAGRAM):\s*([\d\w-]+)(?=\s|$|,)/i, '')
        .replace(/(?:ALIGNMENT):\s*([A-Za-z ]+?)(?=\s*(?:TRAITS|MBTI|ENNEAGRAM|TYPE):|$|,)/i, '')
        .replace(/TRAITS:/i, '')
        .trim();
      
      if (remainingText) {
        updatedCharacter.personality.traits = remainingText;
      }
    }
  }

  // Parse abilities
  const abilitiesBlock = extractSectionContent("ABILITIES");
  if (abilitiesBlock) {
    console.log("Parsing abilities block:", abilitiesBlock);
    
    // Try various label patterns for main ability
    const mainAbilityMatch = abilitiesBlock.match(/(?:MAIN[\s_-]*ABILITY|SPECIAL[\s_-]*ABILITY|UNIQUE[\s_-]*ABILITY):\s*([^,\n]+)/i);
    if (mainAbilityMatch) updatedCharacter.abilities.mainAbility = mainAbilityMatch[1].trim();
    
    // Try various label patterns for signature skills
    const skillsMatch = abilitiesBlock.match(/(?:SIGNATURE[\s_-]*SKILLS|SKILLS|ACTIVE[\s_-]*SKILLS):\s*([\s\S]*?)(?=\s*(?:PASSIVE|UNIQUE|MAIN|$))/i);
    if (skillsMatch) updatedCharacter.abilities.signatureSkills = skillsMatch[1].trim();
    
    // Try various label patterns for passives
    const passivesMatch = abilitiesBlock.match(/(?:PASSIVE[\s_-]*(?:ABILITIES|SKILLS)|PASSIVES):\s*([\s\S]*?)$/i);
    if (passivesMatch) updatedCharacter.abilities.passives = passivesMatch[1].trim();
  } else {
    // Try direct section extraction if abilities block not found
    const mainAbility = extractSectionContent("MAIN ABILITY") || extractSectionContent("SPECIAL ABILITY");
    const signatureSkills = extractSectionContent("SIGNATURE SKILLS") || extractSectionContent("SKILLS");
    const passives = extractSectionContent("PASSIVES") || extractSectionContent("PASSIVE ABILITIES");
    
    if (mainAbility) updatedCharacter.abilities.mainAbility = mainAbility;
    if (signatureSkills) updatedCharacter.abilities.signatureSkills = signatureSkills;
    if (passives) updatedCharacter.abilities.passives = passives;
  }

  console.log("Updated character:", updatedCharacter);
  return updatedCharacter;
};
